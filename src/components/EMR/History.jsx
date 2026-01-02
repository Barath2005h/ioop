import React, { useState } from 'react';
import './History.css';

export default function History({ patient }) {
    const [historyData, setHistoryData] = useState({
        // Systemic History
        conditions: [
            { name: '', duration: '', treatment: '', medication: '', dosage: '' }
        ],
        // Refraction
        spectacleUsage: '',
        usageDuration: '',
        typeOfSpectacle: '',
        lensDetails: '',
        condition: ''
    });

    const handleChange = (field, value) => {
        setHistoryData(prev => ({ ...prev, [field]: value }));
    };

    const handleConditionChange = (index, field, value) => {
        const newConditions = [...historyData.conditions];
        newConditions[index][field] = value;
        setHistoryData(prev => ({ ...prev, conditions: newConditions }));
    };

    const addCondition = () => {
        setHistoryData(prev => ({
            ...prev,
            conditions: [...prev.conditions, { name: '', duration: '', treatment: '', medication: '', dosage: '' }]
        }));
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="history-section">
            <div className="section-header-info">
                <span>Ms. Kavitha Mari @ {currentDate} {currentTime}</span>
            </div>

            <h2 className="section-title">History</h2>

            {/* Systemic History */}
            <div className="subsection">
                <h3 className="subsection-title">Systemic History</h3>
                <p className="doctor-info">Dr. Sheetal R, 22 Jul 2025 03:13 PM (GLAUCOMA CLINIC, CHN)</p>

                {historyData.conditions.map((cond, index) => (
                    <div key={index} className="condition-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Condition</label>
                                <select
                                    value={cond.name}
                                    onChange={(e) => handleConditionChange(index, 'name', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select Condition</option>
                                    <option value="DIABETES">DIABETES</option>
                                    <option value="HYPERTENSION">HYPERTENSION</option>
                                    <option value="ASTHMA">ASTHMA</option>
                                    <option value="THYROID">THYROID</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 3 years, 4 months"
                                    value={cond.duration}
                                    onChange={(e) => handleConditionChange(index, 'duration', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Treatment</label>
                                <select
                                    value={cond.treatment}
                                    onChange={(e) => handleConditionChange(index, 'treatment', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select</option>
                                    <option value="Under Rx">Under Rx</option>
                                    <option value="Not Under Rx">Not Under Rx</option>
                                    <option value="Controlled">Controlled</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row medication-row">
                            <div className="form-group">
                                <label>Medication Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., TAB.OKAMET 500MG"
                                    value={cond.medication}
                                    onChange={(e) => handleConditionChange(index, 'medication', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Dosage</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 1-0-1"
                                    value={cond.dosage}
                                    onChange={(e) => handleConditionChange(index, 'dosage', e.target.value)}
                                    className="form-input small"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button className="add-btn" onClick={addCondition}>+ Add Condition</button>
            </div>

            {/* Refraction */}
            <div className="subsection">
                <h3 className="subsection-title">Refraction</h3>

                <div className="refraction-box">
                    <h4>Current Spectacles (1)</h4>
                    <p className="doctor-info">Ms. Kavitha Mari @ Dec 16, 2025 12:48 PM</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Usage</label>
                            <select
                                value={historyData.spectacleUsage}
                                onChange={(e) => handleChange('spectacleUsage', e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select</option>
                                <option value="Regular usage">Regular usage</option>
                                <option value="Occasional usage">Occasional usage</option>
                                <option value="Not using">Not using</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                placeholder="e.g., 1 year"
                                value={historyData.usageDuration}
                                onChange={(e) => handleChange('usageDuration', e.target.value)}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <table className="refraction-table">
                        <tbody>
                            <tr>
                                <td className="label">Type of spectacle</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="e.g., Kryptok Bifocal"
                                        value={historyData.typeOfSpectacle}
                                        onChange={(e) => handleChange('typeOfSpectacle', e.target.value)}
                                        className="form-input"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Lens details</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="e.g., Plastic, White"
                                        value={historyData.lensDetails}
                                        onChange={(e) => handleChange('lensDetails', e.target.value)}
                                        className="form-input"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Condition</td>
                                <td>
                                    <select
                                        value={historyData.condition}
                                        onChange={(e) => handleChange('condition', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
