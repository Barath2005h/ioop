import React, { useState, useEffect } from 'react';
import './Investigation.css';

const API_BASE = 'http://localhost:5000';

export default function Investigation({ patient }) {
    const [investigations, setInvestigations] = useState([
        { name: '', reValue: '', leValue: '', dateTime: '' }
    ]);
    const [dilation, setDilation] = useState({
        status: '', time: '', drops: ''
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedAt, setSavedAt] = useState(null);

    const investigationTypes = {
        'IOP': { rePlaceholder: '18 mm of Hg by Applanation', lePlaceholder: '16 mm of Hg by Applanation' },
        'Blood Pressure': { rePlaceholder: '140 / 80 mm Hg', lePlaceholder: '140 / 80 mm Hg' },
        'K Reading': { rePlaceholder: 'K1: 43.00 D @ 110°\nK2: 44.75 D @ 20°', lePlaceholder: 'K1: 43.00 D @ 75°\nK2: 44.50 D @ 165°', multiline: true },
        'Pachymetry': { rePlaceholder: '520 μm', lePlaceholder: '518 μm' },
        'Gonioscopy': { rePlaceholder: 'Open angles', lePlaceholder: 'Open angles' },
        'A-Scan': { rePlaceholder: 'AL: 23.5 mm', lePlaceholder: 'AL: 23.3 mm' }
    };

    useEffect(() => {
        if (patient?.id) {
            loadData();
        }
    }, [patient?.id]);

    const loadData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/investigation`);
            const result = await response.json();

            if (result.exists && result.data) {
                setInvestigations(result.data.investigations || [{ name: '', reValue: '', leValue: '', dateTime: '' }]);
                setDilation(result.data.dilation || { status: '', time: '', drops: '' });
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
            }
        } catch (error) {
            console.error('Error loading investigation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/investigation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { investigations, dilation },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                alert('Investigation data saved successfully!');
            }
        } catch (error) {
            console.error('Error saving investigation data:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...investigations];
        updated[index][field] = value;
        setInvestigations(updated);
    };

    const handleDilationChange = (field, value) => {
        setDilation(prev => ({ ...prev, [field]: value }));
    };

    const addInvestigation = () => {
        setInvestigations(prev => [...prev, { name: '', reValue: '', leValue: '', dateTime: '' }]);
    };

    const removeInvestigation = (index) => {
        if (investigations.length > 1) {
            setInvestigations(prev => prev.filter((_, i) => i !== index));
        }
    };

    const getConfig = (name) => investigationTypes[name] || investigationTypes['IOP'];

    const handleEdit = () => setIsEditing(true);

    if (loading) {
        return <div className="investigation-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="investigation-container">
            <div className="investigation-header">
                <span className="investigation-title">Investigation</span>
                {isSaved && !isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>Edit</button>
                )}
            </div>

            <div className="investigation-scroll-area">
                <div className="investigation-section-box">
                    <div className="section-badge-row">
                        <span className="badge-blue">Investigations</span>
                        {isSaved && <span className="saved-badge">✓ Saved</span>}
                    </div>

                    {isEditing ? (
                        <>
                            <table className="investigation-table">
                                <thead>
                                    <tr>
                                        <th className="col-icon"></th>
                                        <th className="col-name">Investigation Name</th>
                                        <th className="col-value">RE Values</th>
                                        <th className="col-value">LE Values</th>
                                        <th className="col-date">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investigations.map((inv, idx) => {
                                        const config = getConfig(inv.name);
                                        return (
                                            <tr key={idx}>
                                                <td className="icon-cell">
                                                    <span className="add-icon" onClick={addInvestigation}>+</span>
                                                </td>
                                                <td className="name-cell">
                                                    <select value={inv.name} onChange={(e) => handleChange(idx, 'name', e.target.value)} className="name-select">
                                                        <option value="">Choose the investigation name</option>
                                                        {Object.keys(investigationTypes).map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="value-cell">
                                                    {config.multiline ? (
                                                        <textarea placeholder={config.rePlaceholder} value={inv.reValue} onChange={(e) => handleChange(idx, 'reValue', e.target.value)} rows={3} />
                                                    ) : (
                                                        <input type="text" placeholder={config.rePlaceholder} value={inv.reValue} onChange={(e) => handleChange(idx, 'reValue', e.target.value)} />
                                                    )}
                                                </td>
                                                <td className="value-cell">
                                                    {config.multiline ? (
                                                        <textarea placeholder={config.lePlaceholder} value={inv.leValue} onChange={(e) => handleChange(idx, 'leValue', e.target.value)} rows={3} />
                                                    ) : (
                                                        <input type="text" placeholder={config.lePlaceholder} value={inv.leValue} onChange={(e) => handleChange(idx, 'leValue', e.target.value)} />
                                                    )}
                                                </td>
                                                <td className="date-cell">
                                                    <input type="text" placeholder="16 Dec 2025 05:37 PM" value={inv.dateTime} onChange={(e) => handleChange(idx, 'dateTime', e.target.value)} />
                                                    <button className="remove-btn" onClick={() => removeInvestigation(idx)}>×</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="saved-data-display">
                            {investigations.filter(i => i.name).length > 0 ? (
                                <table className="display-table">
                                    <thead>
                                        <tr><th>Investigation</th><th>RE Value</th><th>LE Value</th><th>Date/Time</th></tr>
                                    </thead>
                                    <tbody>
                                        {investigations.filter(i => i.name).map((inv, idx) => (
                                            <tr key={idx}>
                                                <td>{inv.name}</td>
                                                <td>{inv.reValue || '-'}</td>
                                                <td>{inv.leValue || '-'}</td>
                                                <td>{inv.dateTime || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data">No investigations recorded</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="dilation-section">
                    <h3 className="dilation-title">Dilation</h3>
                    {isEditing ? (
                        <div className="dilation-box">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Dilation Status</label>
                                    <select value={dilation.status} onChange={(e) => handleDilationChange('status', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Dilated">Dilated</option>
                                        <option value="Not Dilated">Not Dilated</option>
                                        <option value="Partially Dilated">Partially Dilated</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Time of Dilation</label>
                                    <input type="time" value={dilation.time} onChange={(e) => handleDilationChange('time', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Drops Used</label>
                                    <input type="text" placeholder="e.g., Tropicamide 1%" value={dilation.drops} onChange={(e) => handleDilationChange('drops', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="saved-data-display">
                            <div className="data-row"><strong>Status:</strong><span>{dilation.status || 'Not specified'}</span></div>
                            <div className="data-row"><strong>Time:</strong><span>{dilation.time || 'Not specified'}</span></div>
                            <div className="data-row"><strong>Drops:</strong><span>{dilation.drops || 'Not specified'}</span></div>
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="action-buttons">
                        <button className="btn-save" onClick={handleSave}>Save Investigation</button>
                    </div>
                )}
            </div>
        </div>
    );
}
