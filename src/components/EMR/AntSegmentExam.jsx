import React, { useState, useEffect } from 'react';
import './AntSegmentExam.css';

const API_BASE = 'http://localhost:5000';

export default function AntSegmentExam({ patient }) {
    const [examData, setExamData] = useState({
        lid: { re: '', le: '' },
        conjunctiva: { re: '', le: '' },
        cornea: { re: '', le: '' },
        anteriorChamber: { re: '', le: '' },
        iris: { re: '', le: '' },
        pupil: { re: '', le: '' },
        lens: { re: '', le: '' },
        ocularMovements: { re: '', le: '' },
        cornealReflex: { re: '', le: '' },
        globe: { re: '', le: '' },
        undilatedFundus: { re: '', le: '' },
        eyeDrawing: { re: '', le: '' }
    });

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
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/antsegmentexam`);
            const result = await response.json();

            if (result.exists && result.data) {
                setExamData(result.data.examData || examData);
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(result.updated_at || result.created_at);
            }
        } catch (error) {
            console.error('Error loading ant segment exam data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/patients/${patient.id}/emr/antsegmentexam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { examData },
                    createdBy: 'Dr. Chris Diana Pius'
                })
            });

            if (response.ok) {
                setIsSaved(true);
                setIsEditing(false);
                setSavedAt(new Date().toISOString());
                alert('Ant. Segment Exam data saved successfully!');
            }
        } catch (error) {
            console.error('Error saving ant segment exam:', error);
            alert('Error saving data. Please try again.');
        }
    };

    const handleChange = (field, eye, value) => {
        setExamData(prev => ({
            ...prev,
            [field]: { ...prev[field], [eye]: value }
        }));
    };

    const handleEdit = () => setIsEditing(true);

    const examFields = [
        { key: 'lid', label: 'Lid', placeholder: 'Normal' },
        { key: 'conjunctiva', label: 'Conjunctiva', placeholder: 'Normal' },
        { key: 'cornea', label: 'Cornea', placeholder: 'Clear' },
        { key: 'anteriorChamber', label: 'Anterior Chamber', placeholder: 'Normal Depth' },
        { key: 'iris', label: 'Iris', placeholder: 'Normal Color and Pattern' },
        { key: 'pupil', label: 'Pupil', placeholder: 'Pharmacologically Dilated' },
        { key: 'lens', label: 'Lens', placeholder: 'PCIOL' },
        { key: 'ocularMovements', label: 'Ocular Movements', placeholder: 'FULL' },
        { key: 'cornealReflex', label: 'Corneal Reflex', placeholder: 'Orthophoric' },
        { key: 'globe', label: 'Globe', placeholder: 'Normal' },
        { key: 'undilatedFundus', label: 'Undilated Fundus', placeholder: 'cdr 0.85' },
        { key: 'eyeDrawing', label: 'Eye Drawing', placeholder: '' }
    ];

    if (loading) {
        return <div className="ant-segment-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="ant-segment-container">
            <div className="ant-segment-header">
                <span className="ant-segment-title">Ant. Segment Exam</span>
                {isSaved && !isEditing && (
                    <button className="btn-edit" onClick={handleEdit}>Edit</button>
                )}
            </div>

            <div className="ant-segment-scroll-area">
                <div className="ant-segment-section-box">
                    <div className="section-badge-row">
                        <span className="badge-blue">Anterior Segment Exam</span>
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
                                    {examFields.map(field => (
                                        <tr key={field.key}>
                                            <td className="label-cell">{field.label}</td>
                                            <td className="value-cell">
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    value={examData[field.key].re}
                                                    onChange={(e) => handleChange(field.key, 're', e.target.value)}
                                                />
                                            </td>
                                            <td className="value-cell">
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    value={examData[field.key].le}
                                                    onChange={(e) => handleChange(field.key, 'le', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
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
                                <thead>
                                    <tr>
                                        <th>Field</th>
                                        <th>Right Eye</th>
                                        <th>Left Eye</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examFields.map(field => (
                                        <tr key={field.key}>
                                            <td>{field.label}</td>
                                            <td>{examData[field.key].re || '-'}</td>
                                            <td>{examData[field.key].le || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
