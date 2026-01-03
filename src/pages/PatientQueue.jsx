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

        // Handle both mrNumber (frontend) and mr_number (database) field names
        const patientMR = selectedPatient.mrNumber || selectedPatient.mr_number || '';
        const last3Digits = patientMR.toString().slice(-3);

        if (mrInput === last3Digits) {
            setShowModal(false);
            navigate(`/emr/${selectedPatient.id}`);
        } else {
            setError(`Incorrect! Please enter the correct MR Number digits. (Hint: last 3 digits of ${patientMR})`);
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
                            <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                MR: {selectedPatient?.mrNumber || selectedPatient?.mr_number}
                            </span>
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
                        <select className="clinic-select">
                            <option>Glaucoma</option>
                        </select>
                        <ChevronDown size={12} className="dropdown-arrow" />
                    </div>
                    <button className="header-btn exam-btn">Doctor Exam</button>
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
                    <div className="alert-badge">
                        <span className="alert-icon">⚠</span>
                        <span className="alert-text">REVT</span>
                    </div>
                    <div className="kpi-badges">
                        <div className="kpi-block">
                            <span className="kpi-label">Glaucoma Clinic</span>
                            <span className="kpi-value">177</span>
                        </div>
                        <div className="kpi-block">
                            <span className="kpi-label">Waiting</span>
                            <span className="kpi-value">{patients.filter(p => p.status === 'Waiting').length}</span>
                        </div>
                        <div className="kpi-block">
                            <span className="kpi-label">&gt; 2 hrs</span>
                            <span className="kpi-value">13</span>
                        </div>
                        <div className="kpi-block">
                            <span className="kpi-label">VC</span>
                            <span className="kpi-value">124</span>
                        </div>
                        <div className="kpi-block highlight">
                            <span className="kpi-label">Total OP</span>
                            <span className="kpi-value">1388</span>
                        </div>
                    </div>
                    <div className="user-menu">
                        <span className="user-name">Chris Diana Pius</span>
                        <Menu size={18} />
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
                                    <div className="info-icon-circle">
                                        <Info size={14} />
                                    </div>
                                </td>
                                <td>
                                    <div className="patient-info-cell">
                                        <div className="patient-details-wrapper">
                                            <div className="patient-name">{patient.name}</div>
                                            <div className="patient-parent">{patient.parentInfo || 'S/O -'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{patient.age} yrs</td>
                                <td>
                                    <span className={`gender-circle gender-${patient.gender === 'Male' ? 'M' : 'F'}`}>
                                        {patient.gender === 'Male' ? 'M' : 'F'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`nr-badge nr-${patient.visitType}`}>
                                        {patient.visitType}
                                    </span>
                                </td>
                                <td>{patient.hospitalRegTime || '07:51 AM'}</td>
                                <td>{patient.clinicalInTime || '07:51 AM'}</td>
                                <td className="purpose-cell">{patient.purpose}</td>
                                <td>
                                    <div className={`station-pill ${patient.checkInTimestamp && (Date.now() - patient.checkInTimestamp) > 2 * 60 * 60 * 1000 ? 'danger' :
                                        patient.checkInTimestamp && (Date.now() - patient.checkInTimestamp) > 1 * 60 * 60 * 1000 ? 'warning' : ''
                                        }`}>
                                        <Clock size={12} className="clock-icon" />
                                        <span>{getElapsedTime(patient.checkInTimestamp)}</span>
                                    </div>
                                </td>
                                <td>{patient.assignedTo || 'Unassigned'}</td>
                                <td>
                                    <div className="last-visit-container">
                                        <span className="last-visit-date">{patient.lastVisitDate || '---'}</span>
                                        <span className="last-visit-clinic">{patient.lastClinic || ''}</span>
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
