import React, { useState } from 'react';
import './Refraction.css';

export default function Refraction({ patient }) {
    const [spectacles, setSpectacles] = useState([]);
    const [showAddForm, setShowAddForm] = useState(true);
    const [newSpectacle, setNewSpectacle] = useState({
        usage: '',
        duration: '',
        typeOfSpectacle: '',
        lensDetails: '',
        condition: ''
    });

    const handleChange = (field, value) => {
        setNewSpectacle(prev => ({ ...prev, [field]: value }));
    };

    const addSpectacle = () => {
        if (newSpectacle.usage || newSpectacle.typeOfSpectacle) {
            setSpectacles(prev => [...prev, { ...newSpectacle }]);
            setNewSpectacle({
                usage: '', duration: '', typeOfSpectacle: '', lensDetails: '', condition: ''
            });
            setShowAddForm(false);
        }
    };

    const removeSpectacle = (index) => {
        setSpectacles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="refraction-container">
            {/* Header */}
            <div className="refraction-header">
                <span className="refraction-title">Refraction</span>
            </div>

            {/* Content */}
            <div className="refraction-scroll-area">
                <div className="refraction-section-box">
                    {spectacles.length === 0 && !showAddForm ? (
                        <p className="no-data">No spectacle records. Click "+ Add Another" to add.</p>
                    ) : (
                        spectacles.map((spec, index) => (
                            <div key={index} className="spectacle-entry">
                                <div className="spectacle-header">
                                    <span className="spectacle-title">Current Spectacles ({index + 1})</span>
                                    <button className="remove-btn" onClick={() => removeSpectacle(index)}>×</button>
                                </div>
                                <p className="user-info">Ms. Kavitha Mari @ Dec 16, 2025 12:48 PM</p>
                                <p className="usage-info">{spec.usage}, using for the past {spec.duration}</p>

                                <table className="spectacle-table">
                                    <tbody>
                                        <tr>
                                            <td className="label-cell">Type of spectacle</td>
                                            <td className="value-cell">{spec.typeOfSpectacle}</td>
                                        </tr>
                                        <tr>
                                            <td className="label-cell">Lens details</td>
                                            <td className="value-cell">{spec.lensDetails}</td>
                                        </tr>
                                        <tr>
                                            <td className="label-cell">Condition</td>
                                            <td className="value-cell">{spec.condition}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <div className="add-form-box">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Usage</label>
                                    <select
                                        value={newSpectacle.usage}
                                        onChange={(e) => handleChange('usage', e.target.value)}
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
                                        value={newSpectacle.duration}
                                        onChange={(e) => handleChange('duration', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type of spectacle</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Kryptok Bifocal"
                                        value={newSpectacle.typeOfSpectacle}
                                        onChange={(e) => handleChange('typeOfSpectacle', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Lens details</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Plastic, White"
                                        value={newSpectacle.lensDetails}
                                        onChange={(e) => handleChange('lensDetails', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Condition</label>
                                    <select
                                        value={newSpectacle.condition}
                                        onChange={(e) => handleChange('condition', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn-save" onClick={addSpectacle}>Add</button>
                                <button className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {!showAddForm && (
                        <a href="#" className="add-link" onClick={(e) => { e.preventDefault(); setShowAddForm(true); }}>
                            + Add Another
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
