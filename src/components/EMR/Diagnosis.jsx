import React, { useState, useEffect } from 'react';
import './Diagnosis.css';

const API_BASE = 'http://localhost:5000';

export default function Diagnosis({ patient }) {
    const [diagnoses, setDiagnoses] = useState([]);
    const [newDiagnosis, setNewDiagnosis] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAt, setSavedAt] = useState(null);

    useEffect(() => {
        if (patient?.id) {
            loadData();
        }
    }, [patient?.id]);

    const loadData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/diagnosis`);
            const result = await response.json();

            if (result.exists && result.data) {
                setDiagnoses(result.data.diagnoses || []);
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
            }
        } catch (error) {
            console.error('Error loading diagnosis data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/diagnosis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { diagnoses },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                alert('Diagnosis saved successfully!');
            }
        } catch (error) {
            console.error('Error saving diagnosis:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const addDiagnosis = () => {
        if (newDiagnosis.trim()) {
            setDiagnoses(prev => [...prev, newDiagnosis.trim()]);
            setNewDiagnosis('');
        }
    };

    const removeDiagnosis = (index) => {
        setDiagnoses(prev => prev.filter((_, i) => i !== index));
    };

    const handleEdit = () => setIsEditing(true);

    if (loading) {
        return <div className="diagnosis-section"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="diagnosis-section">
            <div className="section-box">
                <div className="section-header">
                    <h2 className="section-title">Diagnosis</h2>
                    {isSaved && !isEditing && (
                        <button className="btn-edit" onClick={handleEdit}>Edit</button>
                    )}
                </div>
                <p className="doctor-info">
                    Dr. Chris Diana Pius @ {savedAt ? new Date(savedAt).toLocaleString() : new Date().toLocaleString()}
                </p>

                <h3 className="subsection-title">
                    Final Diagnosis
                    {isSaved && <span className="saved-badge">✓ Saved</span>}
                </h3>

                {isEditing ? (
                    <>
                        <ul className="diagnosis-list editable">
                            {diagnoses.map((d, idx) => (
                                <li key={idx}>
                                    {d}
                                    <button className="remove-btn" onClick={() => removeDiagnosis(idx)}>×</button>
                                </li>
                            ))}
                        </ul>

                        <div className="add-diagnosis-form">
                            <input
                                type="text"
                                value={newDiagnosis}
                                onChange={(e) => setNewDiagnosis(e.target.value)}
                                placeholder="Enter diagnosis (e.g., RE POAG - primary open-angle glaucoma)"
                                onKeyDown={(e) => e.key === 'Enter' && addDiagnosis()}
                            />
                            <button className="btn-add" onClick={addDiagnosis}>Add</button>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-save" onClick={handleSave}>Save Diagnosis</button>
                        </div>
                    </>
                ) : (
                    <div className="saved-data-display">
                        {diagnoses.length > 0 ? (
                            <ul className="diagnosis-list">
                                {diagnoses.map((d, idx) => (
                                    <li key={idx}>{d}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data">No diagnoses recorded</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
