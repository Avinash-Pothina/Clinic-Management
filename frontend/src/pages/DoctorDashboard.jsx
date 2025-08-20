import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { usePatients } from '../PatientContext';
import { createPrescription, getPrescriptions } from '../api';
import { Link, useLocation } from 'react-router-dom';

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { patients, loading: patientsLoading, updateTrigger } = usePatients();
  const [selected, setSelected] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({ diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [patientPrescriptions, setPatientPrescriptions] = useState({}); // { [patientId]: [prescriptions] }
  const [showPrevDropdown, setShowPrevDropdown] = useState(false);
  const diagnosisInputRef = useRef(null);
  const [fetchError, setFetchError] = useState('');
  const prescriptionFormRef = useRef(null); // Ref for the prescription form section
  const [selectTrigger, setSelectTrigger] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (user?.role !== 'doctor') return;
    setFetchError('');
    getPrescriptions().then(res => {
      const map = {};
      if (Array.isArray(res.data)) {
        res.data.forEach(presc => {
          if (presc.patient && presc.patient._id) {
            if (!map[presc.patient._id]) map[presc.patient._id] = [];
            map[presc.patient._id].push(presc);
          }
        });
      }
      setPatientPrescriptions(map);
    }).catch((err) => {
      console.error("Error fetching prescriptions:", err);
      setFetchError('Unable to fetch prescriptions. Please try again.');
    });
  }, [user]);

  // Effect for scrolling to the prescription form and focusing the diagnosis input
  useEffect(() => {
    if (selectedPatient) {
      // Use requestAnimationFrame for smoother behavior after DOM update
      // A small timeout can also help ensure the ref is available after state update
      const scrollTimeout = setTimeout(() => {
        if (prescriptionFormRef.current) {
          prescriptionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Changed block to 'start' for better visibility
        }
        // Focus on diagnosis input if it exists and a patient is selected
        if (diagnosisInputRef.current) {
          diagnosisInputRef.current.focus();
        }
      }, 50); // Small delay to ensure render and ref attachment
      return () => clearTimeout(scrollTimeout); // Cleanup timeout
    }
  }, [selectedPatient, selectTrigger]); // Trigger when selectedPatient changes

  // Clear selected patient if it's deleted from global context
  useEffect(() => {
    if (selected && !patients.find(p => p._id === selected._id)) {
      setSelected(null);
      setSelectedPatient(null);
    }
  }, [patients, selected, updateTrigger]);

  const handleSelect = patient => {
    setSelected(patient);
    setSelectedPatient(patient._id); // This state change will trigger the useEffect for scrolling
    setSelectTrigger(trigger => trigger + 1);
    setForm({ diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' });
    setSuccess('');
    setError('');
  };

  const handleMedChange = (idx, e) => {
    const meds = [...form.medicines];
    meds[idx][e.target.name] = e.target.value;
    setForm({ ...form, medicines: meds });
  };

  const addMedicine = () => {
    setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }] });
  };

  const removeMedicine = (idx) => {
    const meds = form.medicines.filter((_, i) => i !== idx);
    setForm({ ...form, medicines: meds });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const prescription = await createPrescription({
        patient: selected._id,
        patientName: selected.name,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes
      });
      setSuccess('Prescription submitted!');
      // Reset form after successful submission
      setForm({ diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' });
      // Update patient prescriptions list
      setPatientPrescriptions(prev => {
        const prevList = prev[selected._id] || [];
        return { ...prev, [selected._id]: [...prevList, prescription.data || {}] };
      });
      // Auto-focus diagnosis input for next prescription
      setTimeout(() => diagnosisInputRef.current?.focus(), 100);
    } catch (err) {
      console.error("Prescription submission error:", err);
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Please Log In</h2>
          <p className="mb-4">You need to be logged in as a doctor to access this page.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  
  if (user.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="mb-4">This page is only accessible to doctors.</p>
          <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  return (
    <div key={updateTrigger} className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl mb-8">
        <h2 className="text-xl font-bold mb-4">Patient List</h2>
        {patientsLoading ? (
          <Spinner />
        ) : fetchError ? (
          <div className="text-center text-red-500 py-8">{fetchError}</div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Gender</th>
                  <th className="px-4 py-2 text-left">Token</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p._id} className={selected?._id === p._id ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.age}</td>
                    <td className="px-4 py-2">{p.gender}</td>
                    <td className="px-4 py-2">{p.tokenNumber}</td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <button onClick={() => { handleSelect(p); setShowPrevDropdown(false); }} className="text-blue-600 cursor-pointer hover:underline font-semibold">Select</button>
                      {patientPrescriptions[p._id] && patientPrescriptions[p._id].length > 0 && (
                        <span className="text-green-600 text-lg ml-1">✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selected && (
        // Attach the ref to the div that wraps the prescription form
        <div ref={prescriptionFormRef} id="prescriptionSection" className="bg-white p-8 rounded shadow-md w-full max-w-2xl relative pt-16">
          <div className="absolute top-2 right-2 flex gap-2 items-center">
            {patientPrescriptions[selected._id] && patientPrescriptions[selected._id].length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-semibold text-sm"
                  onClick={() => setShowPrevDropdown(v => !v)}
                >
                  View Previous Prescription
                </button>
                {showPrevDropdown && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                    {patientPrescriptions[selected._id].map((presc, idx) => (
                      <div key={presc._id || idx} className="p-3 border-b last:border-b-0">
                        <div className="font-bold">Diagnosis:</div>
                        <div>{presc.diagnosis}</div>
                        <div className="font-bold mt-1">Medicines:</div>
                        <ul className="list-disc ml-5">
                          {presc.medicines.map((med, i) => (
                            <li key={i}>{med.name}{med.dosage && ` - ${med.dosage}`}{med.frequency && ` - ${med.frequency}`}{med.duration && ` - ${med.duration}`}</li>
                          ))}
                        </ul>
                        {presc.notes && <div className="mt-1"><span className="font-bold">Notes:</span> {presc.notes}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              className="text-black p-5 text-2xl hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => {
                setSelected(null);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when closing
              }}
              aria-label="Close"
            >
              X
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">Prescription for <span className="text-blue-700">{selected.name}</span></h3>
          {success && <div className="mb-2 text-green-600">{success}</div>}
          {error && <div className="mb-2 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Diagnosis</label>
              <input ref={diagnosisInputRef} name="diagnosis" onClick={() => setShowPrevDropdown(false)} value={form.diagnosis} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Medicines</label>
              <div className={form.medicines.length > 2 ? "max-h-[220px] overflow-y-auto" : ""}>
                {form.medicines.map((med, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center">
                    <input name="name" placeholder="Name" value={med.name} onChange={e => handleMedChange(idx, e)} className="border rounded px-2 py-1 flex-1" required />
                    <input name="dosage" placeholder="Dosage" value={med.dosage} onChange={e => handleMedChange(idx, e)} className="border rounded px-2 py-1 flex-1" />
                    <input name="frequency" placeholder="Frequency" value={med.frequency} onChange={e => handleMedChange(idx, e)} className="border rounded px-2 py-1 flex-1" />
                    <input name="duration" placeholder="Duration" value={med.duration} onChange={e => handleMedChange(idx, e)} className="border rounded px-2 py-1 flex-1" />
                    <input name="notes" placeholder="Notes" value={med.notes} onChange={e => handleMedChange(idx, e)} className="border rounded px-2 py-1 flex-1" />
                    {form.medicines.length > 1 && (
                      <button type="button" onClick={() => removeMedicine(idx)} className="text-red-500 font-bold text-lg px-2">×</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addMedicine} className="text-blue-600 hover:underline text-sm mt-1">+ Add Medicine</button>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Submit Prescription</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;