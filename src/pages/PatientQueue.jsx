import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Plus, ChevronDown, Clock, Menu, X, AlertCircle } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import './PatientQueue.css';

// Helper function to calculate elapsed time
function getElapsedTime(checkInTimestamp) {
    if (!checkInTimestamp) return '0 Mins';
    const elapsed = Date.now() - checkInTimestamp;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours} Hrs ${minutes} Mins`;
    }
    return `${minutes} Mins`;
}

export default function PatientQueue() {
    const navigate = useNavigate();
    const { patients } = usePatients();
    const [activeTab, setActiveTab] = useState('All');
    const [currentTime, setCurrentTime] = useState(Date.now());

    // MR Verification Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [mrInput, setMrInput] = useState('');
    const [error, setError] = useState('');

    // Update elapsed time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setMrInput('');
        setError('');
        setShowModal(true);
    };

    const handleVerify = () => {
        if (!mrInput) {
            setError('Please enter the last 3 digits');
            return;
        }

        const last3Digits = selectedPatient.mrNumber?.slice(-3);

        if (mrInput === last3Digits) {
            setShowModal(false);
            navigate(`/emr/${selectedPatient.id}`);
        } else {
            setError('Incorrect! Please enter the correct MR Number digits.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPatient(null);
        setMrInput('');
        setError('');
    };

    return (
        <div className="queue-page">
            {/* MR Number Verification Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>
                            <X size={18} />
                        </button>
                        <div className="modal-header">
                            <span className="patient-highlight">{selectedPatient?.name}</span>
                        </div>
                        <div className="modal-body">
                            <label>Enter last 3 digits of MR Number</label>
                            <input
                                type="text"
                                value={mrInput}
                                onChange={(e) => {
                                    setMrInput(e.target.value);
                                    setError('');
                                }}
                                maxLength={3}
                                placeholder="_ _ _"
                                className="mr-verify-input"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            />
                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-verify" onClick={handleVerify}>Verify & Open</button>
                            <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Blue Header */}
            <div className="queue-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Logo" className="header-logo" />
                    <span className="header-brand">eyeNotes</span>
                    <div className="op-toggle">
                        <span className="op-label">OP</span>
                    </div>
                    <div className="header-dropdown">
                        <span>Glaucoma</span>
                        <ChevronDown size={12} />
                    </div>
                    <button className="header-btn">Doctor Exam</button>
                    <div className="header-search">
                        <input type="text" placeholder="Patient Details" />
                        <Search size={14} className="search-icon" />
                    </div>
                    <button className="waiting-list-btn">
                        Waiting List
                        <span className="waiting-count">{patients.length}</span>
                    </button>
                </div>

                <div className="header-right">
                    <div className="kpi-badges">
                        <div className="kpi-badge red">
                            <span className="badge-icon">⚠</span>
                            <span className="badge-label">REVT</span>
                        </div>
                        <div className="kpi-badge">
                            <span className="badge-label">Glaucoma Clinic</span>
                            <span className="badge-value">177</span>
                        </div>
                        <div className="kpi-badge">
                            <span className="badge-label">Waiting</span>
                            <span className="badge-value">{patients.filter(p => p.status === 'Waiting').length}</span>
                        </div>
                        <div className="kpi-badge">
                            <span className="badge-label">&gt; 2 hrs</span>
                            <span className="badge-value">13</span>
                        </div>
                        <div className="kpi-badge">
                            <span className="badge-label">VC</span>
                            <span className="badge-value">124</span>
                        </div>
                        <div className="kpi-badge highlight">
                            <span className="badge-label">Total OP</span>
                            <span className="badge-value">1388</span>
                        </div>
                    </div>
                    <div className="user-menu">
                        <Menu size={18} />
                        <span className="user-name">Chris Diana Plus</span>
                    </div>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="tabs-row">
                <div className="tabs-left">
                    <div
                        className={`tab ${activeTab === 'Assigned' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Assigned')}
                    >
                        Assigned
                    </div>
                    <div
                        className={`tab ${activeTab === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveTab('All')}
                    >
                        All ({patients.length})
                    </div>
                    <div
                        className={`tab ${activeTab === 'Completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Completed')}
                    >
                        Completed (125)
                    </div>
                </div>
                <div className="tabs-right">
                    <div className="tab tele-tab">Tele Ophthalmology (6)</div>
                </div>
            </div>

            {/* Patient Table */}
            <div className="patient-table-container">
                <table className="patient-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Patient Details</th>
                            <th>Age</th>
                            <th>Sex</th>
                            <th>N/R</th>
                            <th>Hospital Reg. Time</th>
                            <th>Clinical in Time</th>
                            <th>Purpose of Visit</th>
                            <th>Stations</th>
                            <th>Examined/Assigned To</th>
                            <th>Last Visit Date & Clinic</th>
                            <th>Last Treatment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => (
                            <tr
                                key={patient.id}
                                onClick={() => handlePatientClick(patient)}
                                className={index % 2 === 0 ? 'row-alt' : ''}
                            >
                                <td className="text-center">
                                    <Info size={16} color="#0089cf" />
                                </td>
                                <td>
                                    <div className="patient-info-cell">
                                        <div className="patient-details-wrapper">
                                            <div className="patient-name">{patient.name}</div>
                                            <div className="patient-parent">{patient.parentInfo || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{patient.age} yrs</td>
                                <td>
                                    <span className={`gender-badge gender-${patient.gender === 'Male' ? 'M' : 'F'}`}>
                                        {patient.gender === 'Male' ? 'M' : 'F'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`visit-badge visit-${patient.visitType}`}>
                                        {patient.visitType}
                                    </span>
                                </td>
                                <td>{patient.hospitalRegTime}</td>
                                <td>{patient.clinicalInTime}</td>
                                <td className="purpose-cell">{patient.purpose}</td>
                                <td>
                                    <div className="station-time">
                                        <Clock size={12} />
                                        <span>{getElapsedTime(patient.checkInTimestamp)}</span>
                                    </div>
                                </td>
                                <td>{patient.assignedTo || '—'}</td>
                                <td>
                                    <div className="last-visit-info">
                                        <span className="visit-date">{patient.lastVisitDate || '---'}</span>
                                        <span className="visit-clinic">{patient.lastClinic || ''}</span>
                                    </div>
                                </td>
                                <td className="treatment-cell">{patient.lastTreatment || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Bar */}
            <div className="queue-footer">
                <div className="footer-left">
                    <span className="location">Chennai</span>
                    <span className="version">v231225</span>
                </div>
                <div className="footer-center">
                    Copyright AC 2012 EMR. All rights reserved.
                </div>
                <div className="footer-right">
                    <button className="helpdesk-btn">
                        <span className="help-icon">📧</span>
                        Helpdesk
                    </button>
                    <span className="phone-numbers">Ext: 400, 401, 402, 403</span>
                </div>
            </div>

            {/* Floating New Patient Button */}
            <button className="fab-new-patient" onClick={() => navigate('/registration')}>
                <Plus size={20} />
            </button>
        </div>
    );
}
