import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { usePatients } from '../PatientContext';
import { getBills, createBill, payBill, getPrescriptions, updateBill as apiUpdateBill, deleteBill as apiDeleteBill } from '../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = ({ clientSecret, billAmount, patientName, onSuccess, onCancel, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      setLoading(false);
      setProcessing(false);
      return;
    }

    try {
          const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: patientName,
          },
        },
      });

      if (result.error) {
        // Handle payment error
        if (result.error.type === 'card_error' || result.error.type === 'validation_error') {
          setError(result.error.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        onError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful
        onSuccess(result.paymentIntent);
      } else if (result.paymentIntent.status === 'requires_action') {
        // Handle 3D Secure authentication
        setError('Payment requires additional authentication. Please complete the verification.');
        onError('Payment requires additional authentication');
      } else {
        // Handle other payment states
        setError('Payment is being processed. Please wait.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      onError('Payment failed');
    }

    setLoading(false);
    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">Complete Payment</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Amount: ₹{billAmount}</p>
        <p className="text-sm text-gray-600">Patient: {patientName}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!stripe || loading || processing}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : processing ? 'Confirming...' : 'Pay ₹' + billAmount}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || processing}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>💳 We accept all major credit and debit cards</p>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

const BillingDashboard = () => {
  const { user } = useAuth();
  const { patients, removePatient } = usePatients();
  const [bills, setBills] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState('');
  const [expandedBillId, setExpandedBillId] = useState(null);
  const [prescriptions, setPrescriptions] = useState({}); // { [patientId]: [prescription, ...] }
  const [loadingPrescription, setLoadingPrescription] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [selectedPatientPrescriptions, setSelectedPatientPrescriptions] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  
  // Stripe payment states
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [stripeBillData, setStripeBillData] = useState(null);

  // Ref for amount input field
  const amountInputRef = useRef(null);

  // Delete loading state
  const [deletingBillId, setDeletingBillId] = useState(null);

  useEffect(() => {
    if (user?.role !== 'receptionist') return;
    setLoading(true);
    setFetchError('');
    const fetchData = async () => {
      try {
        const billsRes = await getBills();
        setBills(Array.isArray(billsRes.data) ? billsRes.data : []);
        setLoading(false);
      } catch (err) {
        setFetchError('Unable to fetch data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Auto-focus amount input when patient is selected and prescriptions are available
  useEffect(() => {
    if (selectedPatientPrescriptions.length > 0 && amountInputRef.current) {
      // Small delay to ensure the input is rendered
      const timer = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedPatientPrescriptions.length]);

  const refreshBills = async () => {
    const billsRes = await getBills();
    setBills(billsRes.data);
  };

  if (user?.role !== 'receptionist') {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  if (loading) return <Spinner />;
  if (fetchError) return <div className="flex flex-col items-center justify-center min-h-screen"><div className="text-red-500 text-lg">{fetchError}</div></div>;

  const handlePatientSelect = async (e) => {
    const patientId = e.target.value;
    setSelectedPatient(patientId);
    const patient = patients.find(p => p._id === patientId);
    setSelectedPatientDetails(patient);
    // Fetch prescriptions for this patient
    const res = await getPrescriptions();
    const patientPrescs = res.data.filter(presc => presc.patient && presc.patient._id === patientId);
    setSelectedPatientPrescriptions(patientPrescs);
  };

  const handleCreateBill = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setCreating(true);
    try {
      // Check if patient already has a bill
      const existingBill = bills.find(b => b.patient && b.patient._id === selectedPatient);
      if (existingBill) {
        // Update the bill by adding the new amount and reset status to pending if it was paid and amount changed
        const updatedAmount = Number(amount);
        const updateData = { amount: updatedAmount };
        if (existingBill.status === 'paid' && existingBill.amount !== updatedAmount) {
          updateData.status = 'pending';
        }
        await apiUpdateBill(existingBill._id, updateData);
        setSuccess('Bill updated successfully!');
      } else {
        await createBill({ patient: selectedPatient, amount: Number(amount) });
        setSuccess('Bill created successfully!');
      }
      setSelectedPatient('');
      setAmount('');
      setSelectedPatientDetails(null);
      setSelectedPatientPrescriptions([]);
      await refreshBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Bill creation failed');
    }
    setCreating(false);
  };

  const handlePayBill = async (billId) => {
    setPaying(billId);
    setSuccess('');
    setError('');
    try {
      // Simulate Stripe payment with a dummy payment method id
      await payBill(billId, 'pm_card_visa');
      setSuccess('Payment successful!');
      await refreshBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
    setPaying('');
  };

  const handleTogglePrescription = async (bill) => {
    if (expandedBillId === bill._id) {
      setExpandedBillId(null);
      return;
    }
    setExpandedBillId(bill._id);
    if (!prescriptions[bill.patient?._id]) {
      setLoadingPrescription(true);
      try {
        const res = await getPrescriptions();
        // Filter prescriptions for this patient
        const patientPrescriptions = res.data.filter(p => p.patient && p.patient._id === bill.patient._id);
        setPrescriptions(prev => ({ ...prev, [bill.patient._id]: patientPrescriptions }));
      } finally {
        setLoadingPrescription(false);
      }
    }
  };

  const handleOpenPaymentModal = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handleDeleteBill = async (billId) => {
    // Find the bill details for better confirmation message
    const billToDelete = bills.find(bill => bill._id === billId);
    const patientName = billToDelete?.patient?.name || 'Unknown Patient';
    const patientId = billToDelete?.patient?._id;
    const billAmount = billToDelete?.amount || 0;
    
    const confirmMessage = `Are you sure you want to delete the bill for ${patientName} (₹${billAmount})?\n\nThis action cannot be undone and will permanently remove the bill from the database.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setDeletingBillId(billId);
        setError('');
        setSuccess('');
        await apiDeleteBill(billId);
        
        // Remove patient from global context to update all UIs
        if (patientId) {
          removePatient(patientId);
        }
        
        setSuccess(`Bill for ${patientName} has been successfully deleted.`);
        await refreshBills();
      } catch (err) {
        console.error('Delete bill error:', err);
        setError(err.response?.data?.message || 'Failed to delete bill. Please try again.');
      } finally {
        setDeletingBillId(null);
      }
    }
  };

  const handleStripePayment = async (bill) => {
    setCreating(true);
    setError('');
    setSuccess('');
    
    try {
      // Call backend to create PaymentIntent
      const response = await payBill(bill._id, bill.amount);
      const { clientSecret, paymentIntentId } = response.data;
      
      setStripeClientSecret(clientSecret);
      setStripeBillData({
        id: bill._id,
        amount: bill.amount,
        patientName: bill.patient?.name || 'Unknown Patient'
      });
      setShowStripeForm(true);
      setShowPaymentModal(false);
    } catch (err) {
      console.error('Stripe payment initiation error:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    }
    
    setCreating(false);
  };

  const handleStripeSuccess = async (paymentIntent) => {
    await apiUpdateBill(stripeBillData.id, { status: 'paid' });
    setShowStripeForm(false);
    setStripeClientSecret('');
    setStripeBillData(null);
    setSuccess('Payment successful! Your bill has been paid.');
    await refreshBills();
  };

  const handleStripeError = (errorMessage) => {
    setShowStripeForm(false);
    setStripeClientSecret('');
    setStripeBillData(null);
    setError(`Payment failed: ${errorMessage}`);
  };

  const handleStripeCancel = () => {
    setShowStripeForm(false);
    setStripeClientSecret('');
    setStripeBillData(null);
    setError('Payment was cancelled.');
  };

  // Filter bills to ensure each patient appears only once
  const uniqueBills = [];
  const seenPatients = new Set();
  for (const bill of bills) {
    if (bill.patient && !seenPatients.has(bill.patient._id)) {
      uniqueBills.push(bill);
      seenPatients.add(bill.patient._id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Bill</h2>
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <form onSubmit={handleCreateBill} className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 font-medium">Patient</label>
            <select value={selectedPatient} onChange={handlePatientSelect} className="w-full border rounded px-3 py-2" required>
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name} (Token #{p.tokenNumber})</option>
              ))}
            </select>
          </div>
          {selectedPatientDetails && (
            <div className="bg-gray-50 border rounded p-3 mb-3 max-h-[250px] overflow-y-auto">
              <div className="font-bold">Patient Details:</div>
              <div>Name: {selectedPatientDetails.name}</div>
              <div>Age: {selectedPatientDetails.age}</div>
              <div>Gender: {selectedPatientDetails.gender}</div>
              <div>Token: {selectedPatientDetails.tokenNumber}</div>
              <div className="font-bold mt-2">Prescriptions:</div>
              {selectedPatientPrescriptions.length > 0 ? (
                selectedPatientPrescriptions.map((presc, idx) => (
                  <div key={presc._id || idx} className="mb-2">
                    <div className="font-bold">Diagnosis:</div>
                    <div>{presc.diagnosis}</div>
                    <div className="font-bold mt-1">Medicines:</div>
                    <ul className="list-disc ml-5">
                      {presc.medicines.map((med, i) => (
                        <li key={i}>
                          {med.name}
                          {med.dosage && ` - ${med.dosage}`}
                          {med.frequency && ` - ${med.frequency}`}
                          {med.duration && ` - ${med.duration}`}
                        </li>
                      ))}
                    </ul>
                    {presc.notes && <div className="mt-1"><span className="font-bold">Notes:</span> {presc.notes}</div>}
                  </div>
                ))
              ) : (
                <div>No prescriptions found for this patient.</div>
              )}
            </div>
          )}
          <div>
            {selectedPatientPrescriptions.length===0 ? "":
            (<> 
            <label className="block mb-1 font-medium">Amount</label>
            <input 
              ref={amountInputRef}
              type="number" 
              value={amount} 
              placeholder="Enter amount" 
              onChange={e => setAmount(e.target.value)} 
              className="w-full border rounded px-3 py-2" 
              required 
              min="0" 
            />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold" disabled={creating}>{creating ? 'Creating...' : 'Create Bill'}</button>
            </>
          )}
          </div>
        </form>
      </div>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">All Bills</h2>
        {uniqueBills.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No bills found.</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uniqueBills.map(bill => (
                <tr key={bill._id}>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-700 hover:cursor-pointer hover:underline font-semibold focus:outline-none"
                      onClick={() => handleTogglePrescription(bill)}
                    >
                      {bill.patient?.name || 'N/A'}
                    </button>
                    {expandedBillId === bill._id && (
                      <div className="bg-gray-50 border rounded p-3 mt-2 max-h-[250px] overflow-y-auto">
                        {loadingPrescription ? (
                          <div>Loading prescription...</div>
                        ) : (
                          <>
                            {prescriptions[bill.patient?._id] && prescriptions[bill.patient._id].length > 0 ? (
                              prescriptions[bill.patient._id].map((presc, idx) => (
                                <div key={presc._id || idx} className="mb-2">
                                  <div className="font-bold">Diagnosis:</div>
                                  <div>{presc.diagnosis}</div>
                                  <div className="font-bold mt-1">Medicines:</div>
                                  <ul className="list-disc ml-5">
                                    {presc.medicines.map((med, i) => (
                                      <li key={i}>
                                        {med.name}
                                        {med.dosage && ` - ${med.dosage}`}
                                        {med.frequency && ` - ${med.frequency}`}
                                        {med.duration && ` - ${med.duration}`}
                                      </li>
                                    ))}
                                  </ul>
                                  {presc.notes && <div className="mt-1"><span className="font-bold">Notes:</span> {presc.notes}</div>}
                                </div>
                              ))
                            ) : (
                              <div>No prescriptions found for this patient.</div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">₹{bill.amount}</td>
                  <td className="px-4 py-2 capitalize">{bill.status}</td>
                  <td className="px-4 py-2">
                    {bill.status === 'paid' ? (
                      deletingBillId === bill._id ? (
                        <button
                          className="text-red-600 hover:text-red-800 font-semibold"
                          disabled
                          title="Deleting..."
                        >
                          Deleting...
                        </button>
                      ) : (
                        <button
                          className="text-red-600 hover:text-red-800 font-semibold"
                          onClick={() => handleDeleteBill(bill._id)}
                          title="Delete Bill"
                        >
                          Delete
                        </button>
                      )
                    ) : (
                      <button
                        className="hover:cursor-pointer text-green-600 hover:underline hover:cursor-pointer font-semibold focus:outline-none mr-2"
                        onClick={() => handleOpenPaymentModal(bill)}
                      >
                        Pay Bill
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Choose Payment Method</h3>
            <button
              className="hover:cursor-pointer w-full bg-green-600 text-white py-2 rounded mb-2 disabled:opacity-60"
              disabled={creating}
              onClick={async () => {
                setCreating(true);
                setError('');
                try {
                  await apiUpdateBill(selectedBill._id, { status: 'paid' });
                  setShowPaymentModal(false);
                  setSelectedBill(null);
                  setSuccess('Payment successful!');
                  await refreshBills();
                } catch (err) {
                  setError('Payment failed. Please try again.');
                }
                setCreating(false);
              }}
            >
              {creating ? 'Processing...' : 'Cash on Delivery'}
            </button>
            <button
              className="w-full hover:cursor-pointer bg-blue-600 text-white py-2 rounded"
              onClick={() => handleStripePayment(selectedBill)}
              disabled={creating}
            >
              Stripe Payment
            </button>
            <button
              className="hover:cursor-pointer w-full mt-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
            
          </div>
        </div>
      )}

      {/* Stripe Payment Form Modal */}
      {showStripeForm && stripeClientSecret && stripeBillData && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              clientSecret={stripeClientSecret}
              billAmount={stripeBillData.amount}
              patientName={stripeBillData.patientName}
              onSuccess={handleStripeSuccess}
              onCancel={handleStripeCancel}
              onError={handleStripeError}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BillingDashboard;