import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { patients as initialPatients } from '../data/mockPatients';
import * as api from '../services/api';

const PatientContext = createContext();

// Check if backend is available
const USE_BACKEND = true; // Set to false to use localStorage only

export function PatientProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [backendAvailable, setBackendAvailable] = useState(false);

    // Load patients on mount
    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setLoading(true);

        if (USE_BACKEND) {
            try {
                const response = await fetch('http://localhost:5000/api/patients');
                if (response.ok) {
                    const data = await response.json();
                    setPatients(data);
                    setBackendAvailable(true);
                    setLoading(false);
                    return;
                }
            } catch (error) {
                console.warn('Backend not available, falling back to localStorage/mock data');
            }
        }

        // Fallback to localStorage or initial mock patients
        const saved = localStorage.getItem('emr_patients');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.length > 0) {
                    setPatients(parsed);
                } else {
                    setPatients(initialPatients);
                }
            } catch {
                setPatients(initialPatients);
            }
        } else {
            setPatients(initialPatients);
        }
        setBackendAvailable(false);
        setLoading(false);
    };

    // Save to localStorage when patients change (fallback mode)
    useEffect(() => {
        if (!backendAvailable && patients.length > 0) {
            localStorage.setItem('emr_patients', JSON.stringify(patients));
        }
    }, [patients, backendAvailable]);

    const addPatient = async (newPatient) => {
        if (backendAvailable) {
            try {
                const result = await api.createPatient(newPatient);
                // Reload patients to get the new one
                await loadPatients();
                return result.id;
            } catch (error) {
                console.error('Error adding patient to backend:', error);
            }
        }

        // Fallback to local state
        const id = `P${Math.floor(Math.random() * 1000000)}`;
        setPatients(prev => [...prev, { ...newPatient, id }]);
        return id;
    };

    const updatePatient = async (id, updates) => {
        if (backendAvailable) {
            try {
                await api.updatePatient(id, updates);
                await loadPatients();
                return;
            } catch (error) {
                console.error('Error updating patient:', error);
            }
        }

        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const getPatient = useCallback((id) => {
        return patients.find(p => p.id === id);
    }, [patients]);

    const getPatientByMR = useCallback((mrNumber) => {
        return patients.find(p => p.mr_number === mrNumber || p.mrNumber === mrNumber);
    }, [patients]);

    // Fetch patient with full details from backend
    const fetchPatientDetails = async (id) => {
        if (backendAvailable) {
            try {
                return await api.fetchPatientById(id);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        }
        return getPatient(id);
    };

    // Check if MR number exists
    const checkMRExists = async (mrNumber) => {
        if (backendAvailable) {
            try {
                return await api.checkMRExists(mrNumber);
            } catch (error) {
                console.error('Error checking MR:', error);
            }
        }
        const patient = getPatientByMR(mrNumber);
        return { exists: !!patient, patient };
    };

    // Log a visit
    const logVisit = async (patientId, visitData) => {
        if (backendAvailable) {
            try {
                await api.logVisit(patientId, visitData);
                return true;
            } catch (error) {
                console.error('Error logging visit:', error);
            }
        }
        return false;
    };

    return (
        <PatientContext.Provider value={{
            patients,
            loading,
            backendAvailable,
            addPatient,
            updatePatient,
            getPatient,
            getPatientByMR,
            fetchPatientDetails,
            checkMRExists,
            logVisit,
            refreshPatients: loadPatients
        }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatients() {
    return useContext(PatientContext);
}
