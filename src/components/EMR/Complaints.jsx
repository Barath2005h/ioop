import React, { useState } from 'react';
import './Complaints.css';

export default function Complaints({ patient }) {
    const [complaintsData, setComplaintsData] = useState({
        purposeOfVisit: '',
        notes: '',
        ocularHistoryRE: '',
        ocularHistoryLE: '',
        hasSpectacles: 'No'
    });

    const handleChange = (field, value) => {
        setComplaintsData(prev => ({ ...prev, [field]: value }));
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="complaints-container">
            <h2 className="section-title">Complaints & Ocular History</h2>

            {/* Complaints Section */}
            <div className="section-box">
                <div className="section-header">
                    <span className="header-tag complaints-tag">Complaints</span>
                </div>
                <div className="section-content">
                    <div className="doctor-info">
                        <span className="info-badge">P</span>
                        <span>Dr. Chris Diana Pius @ {currentDate} {currentTime}</span>
                    </div>

                    <div className="form-group">
                        <label>Purpose of Visit:</label>
                        <input
                            type="text"
                            placeholder="Enter purpose of visit..."
                            value={complaintsData.purposeOfVisit}
                            onChange={(e) => handleChange('purposeOfVisit', e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes / Observations:</label>
                        <textarea
                            placeholder="Enter notes or observations..."
                            value={complaintsData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            className="form-textarea"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Ocular History Section */}
            <div className="section-box">
                <div className="section-header">
                    <span className="header-tag ocular-tag">Ocular History</span>
                </div>
                <div className="section-content">
                    <div className="ocular-grid">
                        <div className="ocular-column">
                            <h4 className="column-header re-header">RE Description</h4>
                            <textarea
                                placeholder="Enter Right Eye description..."
                                value={complaintsData.ocularHistoryRE}
                                onChange={(e) => handleChange('ocularHistoryRE', e.target.value)}
                                className="form-textarea"
                                rows={4}
                            />
                        </div>
                        <div className="ocular-column">
                            <h4 className="column-header le-header">LE Description</h4>
                            <textarea
                                placeholder="Enter Left Eye description..."
                                value={complaintsData.ocularHistoryLE}
                                onChange={(e) => handleChange('ocularHistoryLE', e.target.value)}
                                className="form-textarea"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="section-box">
                <div className="section-header">
                    <span className="header-tag vision-tag">Vision</span>
                </div>
                <div className="section-content">
                    <div className="form-group inline">
                        <label>Has Spectacles (or) Prescription?</label>
                        <select
                            value={complaintsData.hasSpectacles}
                            onChange={(e) => handleChange('hasSpectacles', e.target.value)}
                            className="form-select"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Print Visit Summary Button */}
            <div className="summary-section">
                <button className="btn-print-summary">Print Visit Summary</button>
            </div>
        </div>
    );
}
