import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { usePatients } from '../PatientContext';
import { generateToken, deletePatient as apiDeletePatient, getHistory } from '../api';

const TokenDashboard = () => {
  const { user } = useAuth();
  const { patients, removePatient } = usePatients();
  const [loading, setLoading] = useState(true);
  const [deletingPatientId, setDeletingPatientId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Calculate next token dynamically from patients
  const nextToken = patients.length > 0 ? Math.max(...patients.map(p => p.tokenNumber)) + 1 : 1;

  useEffect(() => {
    if (user?.role !== 'receptionist') return;
    setLoading(false);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Please Log In</h2>
          <p className="mb-4">You need to be logged in as a receptionist to access this page.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  
  if (user.role !== 'receptionist') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="mb-4">This page is only accessible to receptionists.</p>
          <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const handleDeletePatient = async (patient) => {
    const confirmMessage = `Are you sure you want to delete ${patient.name} (Token #${patient.tokenNumber})?\n\nThis action cannot be undone and will permanently remove the patient and all associated data.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setDeletingPatientId(patient._id);
        setError('');
        setSuccess('');
        
        // Delete patient directly from backend
        await apiDeletePatient(patient._id);
        
        // Remove patient from global context to update all UIs
        removePatient(patient._id);
        
        setSuccess(`${patient.name} has been successfully deleted.`);
      } catch (err) {
        console.error('Delete patient error:', err);
        setError(err.response?.data?.message || 'Failed to delete patient. Please try again.');
      } finally {
        setDeletingPatientId(null);
      }
    }
  };

  const handleShowHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await getHistory();
      setHistoryData(response.data);
      setShowHistory(true);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg relative">
        <button
          onClick={handleShowHistory}
          disabled={historyLoading}
          className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          title="View History"
        >
          {historyLoading ? '...' : '📋'}
        </button>
        <h2 className="text-xl font-bold mb-4">Token Management</h2>
        <div className="mb-6">
          <span className="font-semibold">Next Available Token:</span> <span className="text-blue-600 font-mono">{nextToken}</span>
        </div>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <h3 className="font-semibold mb-2">All Tokens</h3>
        <div className={`${patients.length > 7 ? 'max-h-80 overflow-y-auto' : ''}`}>
          <ul className="divide-y divide-gray-200">
            {patients.map(p => (
              <li key={p._id} className="py-2 flex justify-between items-center">
                <span>{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">Token #{p.tokenNumber}</span>
                  <button
                    onClick={() => handleDeletePatient(p)}
                    disabled={deletingPatientId === p._id}
                    className="text-red-600 hover:text-red-800 font-bold text-lg px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                    title="Delete Patient"
                  >
                    {deletingPatientId === p._id ? '...' : '×'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {showHistory && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Patient History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-900 font-bold hover:text-gray-700 text-xl"
              >
                X
              </button>
            </div>
            <div className="space-y-4">
              {historyData.map((record) => (
                <div key={record._id} className="border p-4 rounded">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Patient:</strong> {record.patient.name}<br/>
                      <strong>Token:</strong> #{record.patient.tokenNumber}
                    </div>
                    <div>
                      <strong>Bill:</strong> {record.bill.billId}<br/>
                      <strong>Amount:</strong> ₹{record.bill.amount}
                    </div>
                    <div>
                      <strong>Archived:</strong> {new Date(record.archivedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {historyData.length === 0 && (
                <p className="text-center text-gray-500">No history records found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDashboard; 