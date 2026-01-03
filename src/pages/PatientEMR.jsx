import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, Folder, Printer, ChevronRight, ChevronDown } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import * as api from '../services/api';
import Layout from '../components/Layout';
import History from '../components/EMR/History';
import Investigation from '../components/EMR/Investigation';
import FundusExam from '../components/EMR/FundusExam';
import Diagnosis from '../components/EMR/Diagnosis';
import Complaints from '../components/EMR/Complaints';
import Refraction from '../components/EMR/Refraction';
import AntSegmentExam from '../components/EMR/AntSegmentExam';
import './PatientEMR.css';

export default function PatientEMR() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatient, fetchPatientDetails, logVisit } = usePatients();

    const [patient, setPatient] = useState(null);
    const [visitHistory, setVisitHistory] = useState([]);
    const [visitCount, setVisitCount] = useState(0);
    const [medicalAlerts, setMedicalAlerts] = useState([]);
    const [activeSection, setActiveSection] = useState('Diagnosis');
    const [expandedSections, setExpandedSections] = useState({
        'Initial Assessment': true,
        'Care Plan': false
    });

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
        loadPatientData();
    }, [patientId]);

    const loadPatientData = async () => {
        try {
            // Try to fetch from backend first
            const patientData = await fetchPatientDetails(patientId);
            if (patientData) {
                setPatient(patientData);
                setVisitCount(patientData.visit_count || patientData.visitHistory?.length || 1);
                setVisitHistory(patientData.visitHistory || []);

                // Parse medical alerts
                const alerts = [];
                if (patientData.medicalAlerts) {
                    alerts.push(...patientData.medicalAlerts);
                }
                if (patientData.allergies) {
                    const allergies = patientData.allergies.split(',').filter(a => a.trim());
                    allergies.forEach(a => alerts.push({ alert_type: 'allergy', alert_value: a.trim() }));
                }
                if (patientData.conditions) {
                    const conditions = patientData.conditions.split(',').filter(c => c.trim());
                    conditions.forEach(c => alerts.push({ alert_type: 'condition', alert_value: c.trim() }));
                }
                setMedicalAlerts(alerts);
            } else {
                // Fallback to local state
                const p = getPatient(patientId);
                if (p) {
                    setPatient(p);
                    setVisitCount(p.visitHistory?.length || 1);
                    setVisitHistory(p.visitHistory || []);
                } else {
                    navigate('/queue');
                }
            }
        } catch (error) {
            console.error('Error loading patient:', error);
            navigate('/queue');
        }
    };

    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    const toggleSection = (title) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Format visit date for display
    const formatVisitDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}, ${year}`;
    };

    // Get badges for a visit
    const getVisitBadges = (visit) => {
        const badges = [];
        if (visit.has_investigation || visit.hasInvestigation) badges.push('Inv');
        if (visit.has_refraction || visit.hasRefraction) badges.push('Rx');
        if (visit.has_glaucoma || visit.hasGlaucoma) badges.push('Gla');
        // Default badge if none
        if (badges.length === 0) badges.push('Gla');
        return badges;
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'Complaints':
                return <Complaints patient={patient} />;
            case 'History':
            case 'Vision':
                return <History patient={patient} />;
            case 'Refraction':
            case 'Refraction - Others':
                return <Refraction patient={patient} />;
            case 'Investigation':
                return <Investigation patient={patient} />;
            case 'Ant. Segment Exam':
                return <AntSegmentExam patient={patient} />;
            case 'Fundus Exam':
            case 'FundusExam':
                return <FundusExam patient={patient} />;
            case 'Diagnosis':
                return <Diagnosis patient={patient} />;
            case 'Any Vulnerabilities':
            case 'Vulnerabilities':
                return <div className="section-placeholder">Vulnerabilities section</div>;
            case 'Dilation':
                return <div className="section-placeholder">Dilation section</div>;
            case 'CarePlan':
            case 'Care Plan':
            case 'Special Investigations':
            case 'General Anaesthesia':
                return <div className="section-placeholder">Care Plan section</div>;
            case 'Nutritional Assess':
                return <div className="section-placeholder">Nutritional Assessment section</div>;
            case 'Anaesthesia':
                return <div className="section-placeholder">Anaesthesia section</div>;
            default:
                return <Diagnosis patient={patient} />;
        }
    };

    if (!patient) return <div className="loading">Loading patient data...</div>;

    return (
        <Layout
            activeSection={activeSection}
            onSectionChange={handleMenuClick}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
        >
            <div className="emr-page">
                {/* Top Blue Header */}
                <div className="queue-header emr-header">
                    <div className="header-left">
                        <img src="/vite.svg" alt="Logo" className="header-logo" onClick={() => navigate('/queue')} style={{ cursor: 'pointer' }} />
                        <span className="header-brand" onClick={() => navigate('/queue')} style={{ cursor: 'pointer' }}>eyeNotes</span>
                        <div className="op-toggle">
                            <span className="op-label">OP</span>
                        </div>
                        <div className="header-dropdown">
                            <select className="clinic-select">
                                <option>Glaucoma</option>
                            </select>
                            <ChevronDown size={12} className="dropdown-arrow" />
                        </div>
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
                                <span className="kpi-value">4</span>
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

                <div className="patient-info-banner">
                    <div className="p-details">
                        <div className="p-main">
                            <span className="p-name">{patient?.name}</span>
                            <span className="p-meta">{patient?.age} yrs / {patient?.gender} / {patient?.mrNumber || patient?.mr_number}</span>
                        </div>
                        <div className="p-sub">
                            <span>{patient?.parentInfo || patient?.parent_info || 'S/O -'}</span>
                        </div>
                    </div>
                    <div className="p-stats">
                        <div className="stat-item">
                            <span className="stat-label">Visit Count</span>
                            <span className="stat-value">{visitCount}</span>
                        </div>
                        <div className="stat-icons">
                            <div className="icon-badge">👁</div>
                            <div className="icon-badge blue">📄</div>
                            <div className="icon-badge green">✔</div>
                        </div>
                        {/* Conditional Medical Alerts - Only show if patient has them */}
                        {medicalAlerts.length > 0 && (
                            <div className="medical-alerts">
                                {medicalAlerts.map((alert, index) => (
                                    <span key={index} className="alert-tag">
                                        {alert.alert_type === 'allergy'
                                            ? `${alert.alert_value} Allergy`
                                            : `Known ${alert.alert_value}`}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - 3 columns */}
                <div className="emr-main-content">
                    {/* LEFT - Visit History Panel */}
                    <div className="visit-history-panel">
                        <div className="panel-header">PREV</div>
                        {visitHistory.length === 0 ? (
                            <div className="no-visits">
                                <p>No previous visits</p>
                                <p className="first-visit">First visit</p>
                            </div>
                        ) : (
                            <div className="visit-list">
                                {visitHistory.map((visit, index) => {
                                    const visitNum = visitCount - index;
                                    const badges = getVisitBadges(visit);
                                    return (
                                        <div key={visit.id || index} className="visit-item-new">
                                            <div className="visit-number-box">{visitNum}</div>
                                            <div className="visit-info">
                                                <span className="visit-date-new">
                                                    {formatVisitDate(visit.visit_date || visit.date)}, {visit.location || 'CHN'}
                                                </span>
                                                <div className="visit-badges-row">
                                                    {badges.map((badge, i) => (
                                                        <span key={i} className={`visit-badge badge-${badge.toLowerCase()}`}>
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="visit-p-badge">P</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
        </Layout>
    );
}
