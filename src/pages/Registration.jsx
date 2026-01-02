import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { User, Camera } from 'lucide-react';
import './Registration.css';

export default function Registration() {
    const navigate = useNavigate();
    const { addPatient } = usePatients();

    const [formData, setFormData] = useState({
        mrNumber: '',
        name: '',
        parentInfo: '',
        age: '',
        gender: 'Male',
        dob: '',
        mobile: '',
        city: '',
        state: 'Tamil Nadu',
        visitType: 'N', // New
        purpose: 'Routine Check-up'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.mrNumber || !formData.name || !formData.age) {
            alert('Please fill MR Number, Name and Age');
            return;
        }

        const newPatient = {
            ...formData,
            hospitalRegTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clinicalInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            checkInTimestamp: Date.now(), // Store timestamp for elapsed time calculation
            assignedTo: 'Unassigned',
            lastVisit: '---',
            lastVisitDate: '---',
            lastClinic: '---',
            status: 'Waiting',
            history: {} // Empty history for new patient
        };

        addPatient(newPatient);
        alert('Patient Registered Successfully!');
        navigate('/queue');
    };

    return (
        <div className="registration-page">
            <div className="reg-header">
                <span>Outpatient Registration</span>
                <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => navigate('/queue')}>
                    Back to Queue
                </button>
            </div>

            <div className="reg-form-container">
                <div className="reg-section-title">Patient Information</div>

                <div className="form-grid">
                    {/* MR Number - First Field */}
                    <div className="input-group mr-number-group">
                        <label>MR Number *</label>
                        <input
                            type="text"
                            name="mrNumber"
                            value={formData.mrNumber}
                            onChange={handleChange}
                            placeholder="Enter MR Number (e.g., 123456)"
                            className="mr-input"
                        />
                    </div>

                    {/* Column 1 */}
                    <div className="input-group">
                        <label>Patient Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" />
                    </div>

                    <div className="input-group">
                        <label>Parent/Guardian Info</label>
                        <input type="text" name="parentInfo" value={formData.parentInfo} onChange={handleChange} placeholder="S/O, D/O, H/O, M/O" />
                    </div>

                    <div className="input-group">
                        <label>Age *</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} style={{ width: '60px' }} />
                            <span style={{ alignSelf: 'center' }}>Yrs</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>DOB</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>

                    {/* Column 2 */}
                    <div className="input-group">
                        <label>City / Area</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label>State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label>Mobile No</label>
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label>Purpose of Visit</label>
                        <select name="purpose" value={formData.purpose} onChange={handleChange}>
                            <option value="Routine Check-up">Routine Check-up</option>
                            <option value="Assess IOP/Progression in GLAUCOMA CLINIC">Assess IOP/Progression in GLAUCOMA CLINIC</option>
                            <option value="Post Surgical Followup">Post Surgical Followup</option>
                            <option value="For Investigations">For Investigations</option>
                            <option value="Routine Examination in GLAUCOMA CLINIC">Routine Examination in GLAUCOMA CLINIC</option>
                        </select>
                    </div>

                    {/* Photo Column */}
                    <div className="photo-placeholder">
                        <div style={{ textAlign: 'center', color: '#aaa' }}>
                            <User size={48} />
                            <div style={{ fontSize: '0.7rem' }}>Photo Identity</div>
                        </div>
                    </div>
                </div>

                <div className="action-bar">
                    <button className="btn-primary" onClick={handleSubmit}>Submit</button>
                    <button className="btn-secondary" style={{ background: '#777' }}>Clear</button>
                </div>
            </div>
        </div>
    );
}
