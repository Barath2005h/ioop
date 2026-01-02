import React, { createContext, useContext, useState, useEffect } from 'react';
import { patients as initialPatients } from '../data/mockPatients';

const PatientContext = createContext();

export function PatientProvider({ children }) {
    // Initialize with mock data, but allow updates
    const [patients, setPatients] = useState(() => {
        const saved = localStorage.getItem('emr_patients');
        return saved ? JSON.parse(saved) : initialPatients;
    });

    useEffect(() => {
        localStorage.setItem('emr_patients', JSON.stringify(patients));
    }, [patients]);

    const addPatient = (newPatient) => {
        setPatients(prev => [...prev, { ...newPatient, id: `P${Math.floor(Math.random() * 1000000)}` }]);
    };

    const updatePatient = (id, updates) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const getPatient = (id) => patients.find(p => p.id === id);

    return (
        <PatientContext.Provider value={{ patients, addPatient, updatePatient, getPatient }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatients() {
    return useContext(PatientContext);
}
