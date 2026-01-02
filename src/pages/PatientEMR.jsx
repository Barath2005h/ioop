import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, Folder, Printer, ChevronRight, ChevronDown } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import History from '../components/EMR/History';
import Investigation from '../components/EMR/Investigation';
import FundusExam from '../components/EMR/FundusExam';
import Diagnosis from '../components/EMR/Diagnosis';
import Complaints from '../components/EMR/Complaints';
import './PatientEMR.css';

export default function PatientEMR() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatient } = usePatients();

    const [patient, setPatient] = useState(null);
    const [activeSection, setActiveSection] = useState('Diagnosis');
    const [expandedSections, setExpandedSections] = useState({
        'Initial Assessment': true,
        'Care Plan': false
    });

    // Visit history
    const visitHistory = [
        { id: 23, date: '16-Dec', location: '25, CHN', type: 'Inv', badges: ['Gla', 'P'] },
        { id: 22, date: '06-Nov', location: '25, CHN', type: 'Rx', badges: ['P'] },
        { id: 21, date: '22-Jul', location: '25, CHN', type: 'Gla', badges: ['P'] },
        { id: 20, date: '29-Jan', location: '25, CHN', type: 'Rx', badges: ['Gla', 'P'] },
        { id: 19, date: '22-Oct', location: '24, CHN', type: 'Inv', badges: ['Gla', 'P'] }
    ];

    // Sidebar menu sections
    const menuSections = [
        { title: 'Complaints', items: [], section: 'Complaints' },
        { title: 'Any Vulnerabilities', items: [], section: 'Vulnerabilities' },
        { title: 'Initial Assessment', items: ['Vision', 'History', 'Refraction', 'Investigation', 'Ant. Segment Exam'], section: 'History' },
        { title: 'Dilation', items: [], section: 'Dilation' },
        { title: 'Fundus Exam', items: [], section: 'FundusExam' },
        { title: 'Care Plan', items: ['Special Investigations'], section: 'CarePlan' },
        { title: 'Diagnosis', items: [], section: 'Diagnosis' }
    ];

    useEffect(() => {
        const p = getPatient(patientId);
        if (p) {
            setPatient(p);
        } else {
            navigate('/queue');
        }
    }, [patientId, getPatient, navigate]);

    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    const toggleSection = (title) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'History':
            case 'Vision':
            case 'Refraction':
                return <History patient={patient} />;
            case 'Investigation':
                return <Investigation patient={patient} />;
            case 'FundusExam':
                return <FundusExam patient={patient} />;
            case 'Diagnosis':
                return <Diagnosis patient={patient} />;
            case 'Complaints':
                return <Complaints patient={patient} />;
            default:
                return <Diagnosis patient={patient} />;
        }
    };

    if (!patient) return <div className="loading">Loading patient data...</div>;

    return (
        <div className="emr-page">
            {/* Top Header Bar */}
            <div className="emr-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Logo" className="header-logo" />
                    <span className="header-brand">eyeNotes</span>
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
                            <span className="badge-value">34</span>
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

            {/* Visit Info Bar */}
            <div className="visit-info-bar">
                <span className="visit-title">
                    23rd Visit 16Dec25, CHN / Aravind Eye Hospital-Chennai / Examined by Dr. Chris Diana Pius
                </span>
                <button className="close-btn" onClick={() => navigate('/queue')}>Close</button>
            </div>

            {/* Main Content - 3 columns */}
            <div className="emr-main-content">
                {/* LEFT - Visit History Panel */}
                <div className="visit-history-panel">
                    <div className="panel-header">PREV</div>
                    {visitHistory.map((visit) => (
                        <div key={visit.id} className="visit-item">
                            <div className="visit-number">{visit.id}</div>
                            <div className="visit-details">
                                <span className="visit-date">{visit.date},</span>
                                <span className="visit-location">{visit.location}</span>
                                <span className="visit-type">{visit.type}</span>
                            </div>
                            <div className="visit-badges">
                                {visit.badges.map((badge, i) => (
                                    <span key={i} className={`mini-badge badge-${badge.toLowerCase()}`}>{badge}</span>
                                ))}
                            </div>
                            <span className="visit-icon-p">P</span>
                        </div>
                    ))}
                    <div className="print-summary-btn">
                        <Printer size={14} />
                        Print Visit Summary
                    </div>
                </div>

                {/* MIDDLE - Content Panel */}
                <div className="content-panel">
                    <div className="content-area">
                        {renderContent()}
                    </div>
                </div>

                {/* RIGHT - Sidebar Menu */}
                <div className="sidebar-menu-panel">
                    <div className="sidebar-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                    </div>

                    {menuSections.map((menu, idx) => (
                        <div key={idx} className="sidebar-section">
                            <div
                                className={`sidebar-item ${activeSection === menu.section ? 'active' : ''}`}
                                onClick={() => {
                                    handleMenuClick(menu.section);
                                    if (menu.items.length > 0) toggleSection(menu.title);
                                }}
                            >
                                <span className="item-text">{menu.title}</span>
                                {menu.items.length > 0 && (
                                    <ChevronRight size={14} className="chevron" />
                                )}
                            </div>
                            {menu.items.length > 0 && expandedSections[menu.title] && (
                                <div className="sub-items">
                                    {menu.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`sub-item ${activeSection === item ? 'active' : ''}`}
                                            onClick={() => handleMenuClick(item)}
                                        >
                                            <ChevronRight size={10} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="sidebar-actions">
                        <button className="btn-next-station">Next Station</button>
                        <button className="btn-print-summary">
                            <Printer size={12} />
                            Print Summary
                            <span className="print-count">0</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="emr-footer">
                <div className="footer-left">
                    <span className="location">Chennai</span>
                    <span className="version">v231225</span>
                </div>
                <div className="footer-center"></div>
                <div className="footer-right">
                    <button className="helpdesk-btn">📧 Helpdesk</button>
                    <span className="phone-numbers">Ext: 400, 401, 402, 403</span>
                </div>
            </div>
        </div>
    );
}
