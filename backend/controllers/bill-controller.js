
const Bill = require('../models/bill-model');
const Patient = require('../models/patient-model');
const { archivePatientData } = require('../services/history-service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const currency = "₹";
const createBill = async (req, res) => {
  try {
    const { patient, amount } = req.body;
    if (!patient || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get patient name
    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Generate a unique billId
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const billId = `BILL-${timestamp}-${randomNum}`;
    
    const bill = await Bill.create({ 
      billId,
      patient, 
      patientName: patientDoc.name,
      amount,
      status: 'pending' // Set initial status
    });
    
    res.status(201).json(bill);
  } catch (err) {
    console.error('Create Bill Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate('patient');
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    // Archive to history if bill status becomes 'paid'
    if (req.body.status === 'paid') {
      await archivePatientData(bill);
    }
    
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const payBill = async (req, res) => {
  try {
    const { billId, amount } = req.body;
    const bill = await Bill.findById(billId).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.status === 'paid') {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    // Create a PaymentIntent with 3D Secure enabled
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((amount || bill.amount) * 100), // amount in smallest currency unit
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      // Enable 3D Secure authentication
      setup_future_usage: 'off_session',
      metadata: { 
        billId: bill._id.toString(), 
        patient: bill.patient.name 
      },
    });

    // Send client_secret to frontend
    res.json({ 
      clientSecret: paymentIntent.client_secret, 
      paymentIntentId: paymentIntent.id,
      requiresAction: paymentIntent.status === 'requires_action'
    });
  } catch (err) {
    console.error('Stripe Payment Error:', err);
    res.status(500).json({ 
      message: 'Payment failed', 
      error: err.message,
      code: err.code 
    });
  }
};

const deleteBill = async (req, res) => {
  try {
    // First, find the bill to get the patient ID
    const bill = await Bill.findById(req.params.id).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    const patientId = bill.patient._id;
    const patientName = bill.patient.name;
    
    // Delete the bill first
    await Bill.findByIdAndDelete(req.params.id);
    
    // Delete all prescriptions associated with this patient
    const Prescription = require('../models/prescription-model');
    await Prescription.deleteMany({ patient: patientId });
    
    // Finally, delete the patient
    await Patient.findByIdAndDelete(patientId);
    
    res.json({ 
      message: 'Bill and associated patient data deleted successfully',
      deletedPatient: patientName
    });
  } catch (err) {
    console.error('Delete bill error:', err);
    res.status(500).json({ message: 'Failed to delete bill and patient data', error: err.message });
  }
};

// New: Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { billId } = req.body;
    const bill = await Bill.findById(billId).populate('patient');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.status === 'paid') {
      return res.status(400).json({ message: 'Bill already paid' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Bill for ${bill.patient.name}`,
            },
            unit_amount: Math.round(bill.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?cancelled=true`,
      metadata: {
        billId: bill._id.toString(),
      },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create Stripe session', error: err.message });
  }
};

// New: Stripe webhook handler
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const billId = session.metadata.billId;
    const bill = await Bill.findByIdAndUpdate(billId, { status: 'paid' }, { new: true }).populate('patient');
    
    // Archive to history when payment is completed
    if (bill) {
      await archivePatientData(bill);
    }
  }
  res.json({ received: true });
};

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  payBill,
  deleteBill,
  createCheckoutSession, // export new endpoint
  handleStripeWebhook,   // export webhook handler
}; 