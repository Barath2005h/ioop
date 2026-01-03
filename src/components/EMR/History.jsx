import React, { useState, useEffect } from 'react';
import './History.css';

const API_BASE = 'http://localhost:5000';

export default function History({ patient }) {
    const [conditions, setConditions] = useState([]);
    const [showAddForm, setShowAddForm] = useState(true);
    const [newCondition, setNewCondition] = useState({
        name: '', duration: '', treatment: '', medication: '', dosage: ''
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAt, setSavedAt] = useState(null);

    // Load existing data on mount
    useEffect(() => {
        if (patient?.id) {
            loadData();
        }
    }, [patient?.id]);

    const loadData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/history`);
            const result = await response.json();

            if (result.exists && result.data) {
                setConditions(result.data.conditions || []);
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
            }
        } catch (error) {
            console.error('Error loading history data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { conditions },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                alert('History data saved successfully!');
            }
        } catch (error) {
            console.error('Error saving history data:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleNewConditionChange = (field, value) => {
        setNewCondition(prev => ({ ...prev, [field]: value }));
    };

    const addCondition = () => {
        if (newCondition.name) {
            setConditions(prev => [...prev, { ...newCondition }]);
            setNewCondition({ name: '', duration: '', treatment: '', medication: '', dosage: '' });
            setShowAddForm(false);
        }
    };

    const removeCondition = (index) => {
        setConditions(prev => prev.filter((_, i) => i !== index));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    if (loading) {
        return <div className="history-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="history-container">
            {/* Header */}
            <div className="history-header">
                <span className="history-title">History</span>
                <span className="history-user-info">
                    {savedAt ? `Saved @ ${new Date(savedAt).toLocaleString()}` : 'Ms. Kavitha Mari @ Dec 16, 2025 12:48 PM'}
                </span>
                {isSaved && !isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>Edit</button>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="history-scroll-area">
                {/* Systemic History */}
                <div className="systemic-section">
                    <h3 className="systemic-title">
                        Systemic History
                        {isSaved && <span className="saved-badge">✓ Saved</span>}
                    </h3>
                    <p className="doctor-info">Dr. Sheetal R, 22 Jul 2025 03:13 PM (GLAUCOMA CLINIC, CHN)</p>

                    {isEditing ? (
                        <>
                            <div className="conditions-list">
                                {conditions.map((cond, index) => (
                                    <div key={index} className="condition-entry">
                                        <div className="condition-main">
                                            <span className="cond-name">{cond.name}</span>
                                            <span className="cond-info"> - {cond.duration}, {cond.treatment}</span>
                                        </div>
                                        {cond.medication && (
                                            <div className="cond-medication">{cond.medication}</div>
                                        )}
                                        {cond.dosage && (
                                            <div className="cond-dosage">{cond.dosage}</div>
                                        )}
                                        <button
                                            className="cond-remove"
                                            onClick={() => removeCondition(index)}
                                        >×</button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Form */}
                            {showAddForm ? (
                                <div className="add-form-box">
                                    <div className="form-line">
                                        <select
                                            value={newCondition.name}
                                            onChange={(e) => handleNewConditionChange('name', e.target.value)}
                                        >
                                            <option value="">Select Condition</option>
                                            <option value="DIABETES">DIABETES</option>
                                            <option value="HYPERTENSION">HYPERTENSION</option>
                                            <option value="ASTHMA">ASTHMA</option>
                                            <option value="THYROID">THYROID</option>
                                            <option value="CARDIAC">CARDIAC</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={newCondition.duration}
                                            onChange={(e) => handleNewConditionChange('duration', e.target.value)}
                                        />
                                        <select
                                            value={newCondition.treatment}
                                            onChange={(e) => handleNewConditionChange('treatment', e.target.value)}
                                        >
                                            <option value="">Treatment</option>
                                            <option value="Under Rx">Under Rx</option>
                                            <option value="Not Under Rx">Not Under Rx</option>
                                        </select>
                                    </div>
                                    <div className="form-line">
                                        <input
                                            type="text"
                                            placeholder="Medication"
                                            value={newCondition.medication}
                                            onChange={(e) => handleNewConditionChange('medication', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dosage"
                                            value={newCondition.dosage}
                                            onChange={(e) => handleNewConditionChange('dosage', e.target.value)}
                                            style={{ maxWidth: '80px' }}
                                        />
                                        <button className="btn-save" onClick={addCondition}>Add</button>
                                        <button className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <a href="#" className="add-link" onClick={(e) => { e.preventDefault(); setShowAddForm(true); }}>
                                    + Add Another
                                </a>
                            )}

                            <div className="action-row">
                                <button className="btn-save" onClick={handleSave}>Save History</button>
                            </div>
                        </>
                    ) : (
                        <div className="saved-data-display">
                            {conditions.length > 0 ? (
                                <div className="conditions-list">
                                    {conditions.map((cond, index) => (
                                        <div key={index} className="condition-display">
                                            <strong>{cond.name}</strong> - {cond.duration}, {cond.treatment}
                                            {cond.medication && <span> | {cond.medication}</span>}
                                            {cond.dosage && <span> ({cond.dosage})</span>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No conditions recorded</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
