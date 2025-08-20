import React from 'react';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Please Log In</h2>
          <p className="mb-4">You need to be logged in to access the dashboard.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.role === 'doctor' ? 'Doctor' : 'Receptionist'}!</h1>
        <p className="mb-4">User ID: <span className="font-mono">{user.id}</span></p>
        <div className="mb-6">
          {user.role === 'receptionist' ? (
            <a href="/tokens" className="text-blue-600 hover:underline font-semibold">Go to Token Management</a>
          ) : (
            <a href="/doctor" className="text-blue-600 hover:underline font-semibold">View Patients</a>
          )}
        </div>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard; 