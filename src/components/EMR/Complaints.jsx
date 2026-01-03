import React, { useState, useEffect } from 'react';
import './Complaints.css';

const API_BASE = 'http://localhost:5000';

export default function Complaints({ patient }) {
    const [complaintsData, setComplaintsData] = useState({
        purposeOfVisit: '',
        notes: ''
    });

    const [ocularHistory, setOcularHistory] = useState([
        { year: '', reDescription: '', leDescription: '' }
    ]);

    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAt, setSavedAt] = useState(null);
    const [savedBy, setSavedBy] = useState(null);

    // Load existing data on mount
    useEffect(() => {
        if (patient?.id) {
            loadData();
        }
    }, [patient?.id]);

    const loadData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/complaints`);
            const result = await response.json();

            if (result.exists && result.data) {
                setComplaintsData(result.data.complaints || { purposeOfVisit: '', notes: '' });
                setOcularHistory(result.data.ocularHistory || [{ year: '', reDescription: '', leDescription: '' }]);
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
                setSavedBy(result.created_by);
            }
        } catch (error) {
            console.error('Error loading complaints data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setComplaintsData(prev => ({ ...prev, [field]: value }));
    };

    const handleOcularChange = (index, field, value) => {
        const updated = [...ocularHistory];
        updated[index][field] = value;
        setOcularHistory(updated);
    };

    const addOcularHistory = () => {
        setOcularHistory(prev => [...prev, { year: '', reDescription: '', leDescription: '' }]);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: {
                        complaints: complaintsData,
                        ocularHistory: ocularHistory
                    },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                setSavedBy('Dr. Chris Diana Pius');
                alert('Complaints data saved successfully!');
            }
        } catch (error) {
            console.error('Error saving complaints data:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (isSaved) {
            loadData(); // Reload saved data
            setIsEditing(false);
        } else {
            setComplaintsData({ purposeOfVisit: '', notes: '' });
            setOcularHistory([{ year: '', reDescription: '', leDescription: '' }]);
        }
    };

    const purposeOptions = ['Select', 'FollowUp', 'New Visit', 'Review', 'Post-Op', 'Emergency'];

    if (loading) {
        return <div className="complaints-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="complaints-container">
            {/* Header */}
            <div className="complaints-header">
                <span className="complaints-title">Complaints & Ocular History</span>
                {isSaved && !isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>Edit</button>
                )}
            </div>

            <div className="complaints-scroll-area">
                {/* Complaints Section */}
                <div className="complaints-section-box">
                    <div className="section-badge-row">
                        <span className="badge-blue">Complaints</span>
                        {isSaved && <span className="saved-badge">✓ Saved</span>}
                    </div>
                    <p className="doctor-info">
                        {savedBy || 'Dr. Chris Diana Pius'} @ {savedAt ? new Date(savedAt).toLocaleString() : new Date().toLocaleString()}
                    </p>

                    {isEditing ? (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Purpose of Visit:</label>
                                    <select
                                        value={complaintsData.purposeOfVisit}
                                        onChange={(e) => handleChange('purposeOfVisit', e.target.value)}
                                    >
                                        {purposeOptions.map(opt => (
                                            <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes / Observations:</label>
                                <textarea
                                    placeholder="On RE AGM, LMA today AM"
                                    value={complaintsData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="action-row">
                                <button className="btn-add" onClick={handleSave}>Save</button>
                                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <div className="saved-data-display">
                            <div className="data-row">
                                <strong>Purpose of Visit:</strong>
                                <span>{complaintsData.purposeOfVisit || 'Not specified'}</span>
                            </div>
                            <div className="data-row">
                                <strong>Notes / Observations:</strong>
                                <span>{complaintsData.notes || 'No notes'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Ocular History Section */}
                <div className="complaints-section-box">
                    <div className="section-badge-row">
                        <span className="badge-green">Ocular History</span>
                    </div>

                    {isEditing ? (
                        <>
                            <table className="ocular-table">
                                <thead>
                                    <tr>
                                        <th className="col-icon"></th>
                                        <th className="col-badge"></th>
                                        <th className="col-year">Year</th>
                                        <th className="col-desc">RE Description</th>
                                        <th className="col-desc">LE Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ocularHistory.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="icon-cell">
                                                <span className="add-icon" onClick={addOcularHistory}>+</span>
                                            </td>
                                            <td>
                                                <span className="badge-purple">S/P</span>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    placeholder="2023"
                                                    value={item.year}
                                                    onChange={(e) => handleOcularChange(idx, 'year', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    placeholder="09 Dec 2023 : LE NPDS + PHACO done"
                                                    value={item.reDescription}
                                                    onChange={(e) => handleOcularChange(idx, 'reDescription', e.target.value)}
                                                    rows={2}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    placeholder="Enter LE description"
                                                    value={item.leDescription}
                                                    onChange={(e) => handleOcularChange(idx, 'leDescription', e.target.value)}
                                                    rows={2}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="action-row">
                                <button className="btn-add" onClick={handleSave}>Save</button>
                                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <div className="saved-data-display">
                            {ocularHistory.filter(h => h.year || h.reDescription || h.leDescription).length > 0 ? (
                                <table className="ocular-display-table">
                                    <thead>
                                        <tr>
                                            <th>Year</th>
                                            <th>RE Description</th>
                                            <th>LE Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ocularHistory.filter(h => h.year || h.reDescription || h.leDescription).map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.year}</td>
                                                <td>{item.reDescription}</td>
                                                <td>{item.leDescription}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">No ocular history recorded</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
