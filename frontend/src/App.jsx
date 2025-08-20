import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { PatientProvider } from './PatientContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import TokenDashboard from './pages/TokenDashboard';
import PatientRegistration from './pages/PatientRegistration';
import BillingDashboard from './pages/BillingDashboard';

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  return (
    <nav className="bg-blue-700 text-white px-4 py-2 flex gap-4 items-center">
      <Link 
        to="/dashboard" 
        className={`font-bold text-lg hover:underline ${location.pathname === '/dashboard' ? 'underline underline-offset-4' : ''}`}
      >
        Clinic System
      </Link>
      {user && user.role === 'doctor' && (
        <>
          <Link
            to="/doctor"
            className={`hover:underline ${location.pathname === '/doctor' ? 'underline underline-offset-4' : ''}`}
          >
            Doctor Dashboard
          </Link>
        </>
      )}
      {user && user.role === 'receptionist' && (
        <>
          <Link 
            to="/tokens" 
            className={`hover:underline ${location.pathname === '/tokens' ? 'underline underline-offset-4' : ''}`}
          >
            Token Dashboard
          </Link>
          <Link 
            to="/register-patient" 
            className={`hover:underline ${location.pathname === '/register-patient' ? 'underline underline-offset-4' : ''}`}
          >
            Register Patient
          </Link>
          <Link 
            to="/billing" 
            className={`hover:underline ${location.pathname === '/billing' ? 'underline underline-offset-4' : ''}`}
          >
            Billing
          </Link>
        </>
      )}
      <div className="flex-1" />
      {!user && (
        <Link 
          to="/login" 
          className={`hover:underline ${location.pathname === '/login' ? 'underline underline-offset-4' : ''}`}
        >
          Login
        </Link>
      )}
      {!user && (
        <Link 
          to="/signup" 
          className={`hover:underline ${location.pathname === '/signup' ? 'underline underline-offset-4' : ''}`}
        >
          Signup
        </Link>
      )}
      {user && <button onClick={logout} className="ml-2 bg-red-500 px-3 py-1 rounded">Logout</button>}
    </nav>
  );
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PatientProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/tokens" element={<TokenDashboard />} />
            <Route path="/register-patient" element={<PatientRegistration />} />
            <Route path="/billing" element={<BillingDashboard />} />
            <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </Elements>
  );
};

export default App;