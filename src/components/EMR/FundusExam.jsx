import React, { useState, useEffect } from 'react';
import './FundusExam.css';

const API_BASE = 'http://localhost:5000';

export default function FundusExam({ patient }) {
    const [examData, setExamData] = useState({
        media: { re: '', le: '' },
        discCdr: { re: '', le: '' },
        discNotch: { re: '', le: '' },
        discPpa: { re: '', le: '' },
        vessels: { re: '', le: '' },
        backgroundRetina: { re: '', le: '' },
        maculaFovealReflex: { re: '', le: '' },
        eyeDrawing: { re: '', le: '' }
    });

    const [specialInvestigations, setSpecialInvestigations] = useState([
        { name: '', reValue: '', leValue: '', dateTime: '' }
    ]);

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
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/fundusexam`);
            const result = await response.json();

            if (result.exists && result.data) {
                setExamData(result.data.examData || examData);
                setSpecialInvestigations(result.data.specialInvestigations || [{ name: '', reValue: '', leValue: '', dateTime: '' }]);
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
            }
        } catch (error) {
            console.error('Error loading fundus exam data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/fundusexam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { examData, specialInvestigations },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                alert('Fundus Exam data saved successfully!');
            }
        } catch (error) {
            console.error('Error saving fundus exam:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleChange = (field, eye, value) => {
        setExamData(prev => ({
            ...prev,
            [field]: { ...prev[field], [eye]: value }
        }));
    };

    const handleInvChange = (index, field, value) => {
        const updated = [...specialInvestigations];
        updated[index][field] = value;
        setSpecialInvestigations(updated);
    };

    const addInvestigation = () => {
        setSpecialInvestigations(prev => [...prev, { name: '', reValue: '', leValue: '', dateTime: '' }]);
    };

    const handleEdit = () => setIsEditing(true);

    const notchOptions = ['Select Notch', 'No Notch', 'Bipolar Notch', 'Superior Notch', 'Inferior Notch', 'Temporal Notch', 'Nasal Notch'];
    const vesselsOptions = ['Select', 'Normal', 'Attenuated', 'Tortuous', 'AV Nicking', 'Silver Wiring'];
    const backgroundRetinaOptions = ['Select', 'Normal', 'Pigmentary Changes', 'Drusen', 'Hemorrhages', 'Exudates'];
    const maculaOptions = ['Select', 'Present', 'Absent', 'Dull', 'Bright'];

    if (loading) {
        return <div className="fundus-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="fundus-container">
            <div className="fundus-header">
                <span className="fundus-title">Fundus Exam</span>
                {isSaved && !isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>Edit</button>
                )}
            </div>

            <div className="fundus-scroll-area">
                <div className="fundus-section-box">
                    <div className="section-badge-row">
                        <span className="badge-blue">Fundus Exam</span>
                        {isSaved && <span className="saved-badge">✓ Saved</span>}
                    </div>
                    <p className="doctor-info">
                        Dr. Chris Diana Pius @ {savedAt ? new Date(savedAt).toLocaleString() : new Date().toLocaleString()}
                    </p>

                    {isEditing ? (
                        <>
                            <table className="exam-table">
                                <thead>
                                    <tr>
                                        <th className="label-col"></th>
                                        <th className="eye-col">Right Eye</th>
                                        <th className="eye-col">Left Eye</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="label-cell">Media</td>
                                        <td className="value-cell"><input type="text" placeholder="Clear" value={examData.media.re} onChange={(e) => handleChange('media', 're', e.target.value)} /></td>
                                        <td className="value-cell"><input type="text" placeholder="Clear" value={examData.media.le} onChange={(e) => handleChange('media', 'le', e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Disc - CDR</td>
                                        <td className="value-cell"><input type="text" placeholder="0.9" value={examData.discCdr.re} onChange={(e) => handleChange('discCdr', 're', e.target.value)} /></td>
                                        <td className="value-cell"><input type="text" placeholder="0.9" value={examData.discCdr.le} onChange={(e) => handleChange('discCdr', 'le', e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Disc - Notch</td>
                                        <td className="value-cell">
                                            <select value={examData.discNotch.re} onChange={(e) => handleChange('discNotch', 're', e.target.value)}>
                                                {notchOptions.map(opt => <option key={opt} value={opt === 'Select Notch' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                        <td className="value-cell">
                                            <select value={examData.discNotch.le} onChange={(e) => handleChange('discNotch', 'le', e.target.value)}>
                                                {notchOptions.map(opt => <option key={opt} value={opt === 'Select Notch' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Disc - PPA</td>
                                        <td className="value-cell"><input type="text" placeholder="PPA" value={examData.discPpa.re} onChange={(e) => handleChange('discPpa', 're', e.target.value)} /></td>
                                        <td className="value-cell"><input type="text" placeholder="PPA" value={examData.discPpa.le} onChange={(e) => handleChange('discPpa', 'le', e.target.value)} /></td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Vessels</td>
                                        <td className="value-cell">
                                            <select value={examData.vessels.re} onChange={(e) => handleChange('vessels', 're', e.target.value)}>
                                                {vesselsOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                        <td className="value-cell">
                                            <select value={examData.vessels.le} onChange={(e) => handleChange('vessels', 'le', e.target.value)}>
                                                {vesselsOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Background Retina</td>
                                        <td className="value-cell">
                                            <select value={examData.backgroundRetina.re} onChange={(e) => handleChange('backgroundRetina', 're', e.target.value)}>
                                                {backgroundRetinaOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                        <td className="value-cell">
                                            <select value={examData.backgroundRetina.le} onChange={(e) => handleChange('backgroundRetina', 'le', e.target.value)}>
                                                {backgroundRetinaOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Macula/Foveal Reflex</td>
                                        <td className="value-cell">
                                            <select value={examData.maculaFovealReflex.re} onChange={(e) => handleChange('maculaFovealReflex', 're', e.target.value)}>
                                                {maculaOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                        <td className="value-cell">
                                            <select value={examData.maculaFovealReflex.le} onChange={(e) => handleChange('maculaFovealReflex', 'le', e.target.value)}>
                                                {maculaOptions.map(opt => <option key={opt} value={opt === 'Select' ? '' : opt}>{opt}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="label-cell">Eye Drawing</td>
                                        <td className="value-cell"><input type="text" value={examData.eyeDrawing.re} onChange={(e) => handleChange('eyeDrawing', 're', e.target.value)} /></td>
                                        <td className="value-cell"><input type="text" value={examData.eyeDrawing.le} onChange={(e) => handleChange('eyeDrawing', 'le', e.target.value)} /></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="action-row">
                                <button className="btn-add" onClick={handleSave}>Save</button>
                                <button className="btn-cancel" onClick={() => isSaved && setIsEditing(false)}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <div className="saved-data-display">
                            <table className="display-table">
                                <thead><tr><th>Field</th><th>Right Eye</th><th>Left Eye</th></tr></thead>
                                <tbody>
                                    <tr><td>Media</td><td>{examData.media.re || '-'}</td><td>{examData.media.le || '-'}</td></tr>
                                    <tr><td>Disc - CDR</td><td>{examData.discCdr.re || '-'}</td><td>{examData.discCdr.le || '-'}</td></tr>
                                    <tr><td>Disc - Notch</td><td>{examData.discNotch.re || '-'}</td><td>{examData.discNotch.le || '-'}</td></tr>
                                    <tr><td>Disc - PPA</td><td>{examData.discPpa.re || '-'}</td><td>{examData.discPpa.le || '-'}</td></tr>
                                    <tr><td>Vessels</td><td>{examData.vessels.re || '-'}</td><td>{examData.vessels.le || '-'}</td></tr>
                                    <tr><td>Background Retina</td><td>{examData.backgroundRetina.re || '-'}</td><td>{examData.backgroundRetina.le || '-'}</td></tr>
                                    <tr><td>Macula/Foveal Reflex</td><td>{examData.maculaFovealReflex.re || '-'}</td><td>{examData.maculaFovealReflex.le || '-'}</td></tr>
                                    <tr><td>Eye Drawing</td><td>{examData.eyeDrawing.re || '-'}</td><td>{examData.eyeDrawing.le || '-'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Special Investigation Section */}
                <div className="special-investigation-section">
                    <h3 className="section-title">Special Investigation</h3>
                    {isEditing ? (
                        <div className="investigation-box">
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
                                    {specialInvestigations.map((inv, idx) => (
                                        <tr key={idx}>
                                            <td className="icon-cell"><span className="add-icon" onClick={addInvestigation}>+</span></td>
                                            <td><input type="text" placeholder="Choose investigation" value={inv.name} onChange={(e) => handleInvChange(idx, 'name', e.target.value)} /></td>
                                            <td><input type="text" placeholder="RE Value" value={inv.reValue} onChange={(e) => handleInvChange(idx, 'reValue', e.target.value)} /></td>
                                            <td><input type="text" placeholder="LE Value" value={inv.leValue} onChange={(e) => handleInvChange(idx, 'leValue', e.target.value)} /></td>
                                            <td><input type="text" placeholder="16 Dec 2025" value={inv.dateTime} onChange={(e) => handleInvChange(idx, 'dateTime', e.target.value)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="saved-data-display">
                            {specialInvestigations.filter(i => i.name).length > 0 ? (
                                <table className="display-table">
                                    <thead><tr><th>Name</th><th>RE</th><th>LE</th><th>Date</th></tr></thead>
                                    <tbody>
                                        {specialInvestigations.filter(i => i.name).map((inv, idx) => (
                                            <tr key={idx}><td>{inv.name}</td><td>{inv.reValue || '-'}</td><td>{inv.leValue || '-'}</td><td>{inv.dateTime || '-'}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className="no-data">No special investigations recorded</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
