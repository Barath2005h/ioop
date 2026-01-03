import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import Login from './pages/Login';
import PatientQueue from './pages/PatientQueue';
import PatientEMR from './pages/PatientEMR';
import Registration from './pages/Registration';
import Layout from './components/Layout';

function AppLayout({ children }) {
    return <Layout>{children}</Layout>;
}

function App() {
    return (
        <PatientProvider>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/queue" element={<PatientQueue />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/emr/:patientId" element={<PatientEMR />} />
                </Routes>
            </div>
        </PatientProvider>
    );
}

export default App;
