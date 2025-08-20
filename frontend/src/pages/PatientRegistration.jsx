import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { usePatients } from '../PatientContext';
import { registerPatient, generateToken } from '../api';

const PatientRegistration = () => {
  const { user } = useAuth();
  const { patients, addPatient } = usePatients();
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', phone: '', email: '', address: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const nameInputRef = useRef(null);
  
  // Calculate next token dynamically from patients
  const token = patients.length > 0 ? Math.max(...patients.map(p => p.tokenNumber)) + 1 : 1;

  useEffect(() => {
    if (user?.role !== 'receptionist') return;
    setLoading(false);
    // Auto-focus name input when form is ready
    setTimeout(() => nameInputRef.current?.focus(), 100);
  }, [user]);

  if (user?.role !== 'receptionist') {
    return <div className="p-8 text-center">Access denied.</div>;
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const validateForm = () => {
    const errors = {};

    // Phone number validation - exactly 10 digits
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    // Age validation - greater than 0 and less than 150
    const age = Number(form.age);
    if (form.age && (isNaN(age) || age <= 0 || age >= 150)) {
      errors.age = 'Age must be a number greater than 0 and less than 150';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await registerPatient({
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        contact: { phone: form.phone, email: form.email, address: form.address },
        tokenNumber: token
      });
      
      // Add patient to global context to update all UIs
      addPatient(response.data);
      
      setSuccess('Patient registered successfully!');
      setForm({ name: '', age: '', gender: 'male', phone: '', email: '', address: '' });
      setValidationErrors({});
      // Auto-focus name input for next patient
      setTimeout(() => nameInputRef.current?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Patient Registration</h2>
        <div className="mb-4">
          <span className="font-semibold">Next Token:</span> <span className="text-blue-600 font-mono">{token}</span>
        </div>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Name</label>
            <input ref={nameInputRef} name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Age</label>
            <input 
              name="age" 
              type="number" 
              value={form.age} 
              onChange={handleChange} 
              className={`w-full border rounded px-3 py-2 ${validationErrors.age ? 'border-red-500' : ''}`} 
              required 
              min="0" 
            />
            {validationErrors.age && (
              <div className="text-red-500 text-sm mt-1">{validationErrors.age}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Phone</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              className={`w-full border rounded px-3 py-2 ${validationErrors.phone ? 'border-red-500' : ''}`} 
              placeholder="Enter 10-digit phone number"
            />
            {validationErrors.phone && (
              <div className="text-red-500 text-sm mt-1">{validationErrors.phone}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Register Patient</button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration; 