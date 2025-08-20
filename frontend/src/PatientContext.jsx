import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatients } from './api';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const removePatient = (patientId) => {
    setPatients(prev => {
      const updated = prev.filter(p => p._id !== patientId);
      setUpdateTrigger(t => t + 1);
      return updated;
    });
  };

  const addPatient = (newPatient) => {
    setPatients(prev => {
      const updated = [...prev, newPatient];
      setUpdateTrigger(t => t + 1);
      return updated;
    });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PatientContext.Provider value={{
      patients,
      loading,
      fetchPatients,
      removePatient,
      addPatient,
      updateTrigger
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => useContext(PatientContext);