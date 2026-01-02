import React from 'react';
import './Diagnosis.css';

export default function Diagnosis({ patient }) {
    const diagnoses = [
        'RE POAG - primary open-angle glaucoma',
        'RE Pseudophakia',
        'LE POAG - primary open-angle glaucoma - s/p NPDS+ PHACO'
    ];

    return (
        <div className="diagnosis-section">
            {/* Diagnosis */}
            <div className="section-box">
                <h2 className="section-title">Diagnosis</h2>
                <p className="doctor-info">Dr. Chris Diana Pius @ Dec 16, 2025 05:37 PM</p>

                <h3 className="subsection-title">Final Diagnosis</h3>
                <ul className="diagnosis-list">
                    {diagnoses.map((d, idx) => (
                        <li key={idx}>{d}</li>
                    ))}
                </ul>
            </div>

            {/* Complaints & Ocular History */}
            <div className="section-box">
                <h2 className="section-title complaints-title">Complaints & Ocular History</h2>

                <div className="tag-section">
                    <span className="tag complaints-tag">Complaints</span>
                </div>
                <p className="doctor-info">Dr. Chris Diana Pius @ Dec 16, 2025 05:07 PM</p>
                <p className="info-line">Purpose of Visit: <strong>FollowUp</strong></p>
                <p className="info-line">On RE AGM, LMA today AM</p>

                <div className="tag-section">
                    <span className="tag ocular-tag">Ocular History</span>
                </div>

                <div className="ocular-grid">
                    <div className="grid-header">
                        <span></span>
                        <span className="re-header">RE Description</span>
                        <span className="le-header">LE Description</span>
                    </div>
                    <div className="grid-row">
                        <span className="sr-badge">Sr/P</span>
                        <span></span>
                        <span className="le-history">
                            <strong>2023</strong> - 09 Dec 2023 : LE NPDS + PHACO done @ Aravind Eye Hospital-Chennai
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
