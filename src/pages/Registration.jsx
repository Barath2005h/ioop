import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { User, Camera, Menu, X, Search } from 'lucide-react';
import './Registration.css';

export default function Registration() {
    const navigate = useNavigate();
    const { addPatient, checkMRExists } = usePatients();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

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
        purpose: 'Routine Check-up',
        allergies: '',
        conditions: ''
    });

    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const [existingPatient, setExistingPatient] = useState(null);
    const [searching, setSearching] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Check if MR number exists
    const handleMRSearch = async () => {
        if (!formData.mrNumber) return;

        setSearching(true);
        try {
            const result = await checkMRExists(formData.mrNumber);
            if (result.exists && result.patient) {
                setExistingPatient(result.patient);
                // Pre-fill form with existing data
                setFormData({
                    mrNumber: result.patient.mr_number || result.patient.mrNumber,
                    name: result.patient.name || '',
                    parentInfo: result.patient.parent_info || result.patient.parentInfo || '',
                    age: result.patient.age || '',
                    gender: result.patient.gender || 'Male',
                    dob: result.patient.dob || '',
                    mobile: result.patient.mobile || '',
                    city: result.patient.city || '',
                    state: result.patient.state || 'Tamil Nadu',
                    visitType: 'R', // Review for existing patient
                    purpose: result.patient.purpose || 'Routine Check-up',
                    allergies: result.patient.allergies || '',
                    conditions: result.patient.conditions || ''
                });
                if (result.patient.photo) {
                    setPhoto(result.patient.photo);
                }
                alert('Existing patient found! Form has been pre-filled.');
            } else {
                setExistingPatient(null);
                setFormData(prev => ({ ...prev, visitType: 'N' }));
            }
        } catch (error) {
            console.error('Error searching MR:', error);
        }
        setSearching(false);
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 320, height: 240 }
            });
            setStream(mediaStream);
            setShowCamera(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            alert('Unable to access camera. Please check permissions.');
            console.error('Camera error:', err);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            setPhoto(imageData);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
    };

    const removePhoto = () => {
        setPhoto(null);
    };

    const handleSubmit = () => {
        if (!formData.mrNumber || !formData.name || !formData.age) {
            alert('Please fill MR Number, Name and Age');
            return;
        }

        const newPatient = {
            ...formData,
            photo: photo,
            hospitalRegTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clinicalInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            checkInTimestamp: Date.now(),
            assignedTo: 'Unassigned',
            lastVisit: '---',
            lastVisitDate: '---',
            lastClinic: '---',
            status: 'Waiting',
            history: {}
        };

        addPatient(newPatient);
        alert('Patient Registered Successfully!');
        navigate('/queue');
    };

    return (
        <div className="registration-page">
            {/* Top Bar matching Queue/EMR */}
            <div className="common-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Logo" className="header-logo" />
                    <span className="header-brand">eyeNotes</span>
                </div>
                <div className="header-right">
                    <button className="btn-back" onClick={() => navigate('/queue')}>
                        Back to Queue
                    </button>
                    <div className="user-menu">
                        <span className="user-name">Chris Diana Pius</span>
                        <Menu size={18} />
                    </div>
                </div>
            </div>

            <div className="reg-title-bar">
                <span>Outpatient Registration</span>
            </div>

            <div className="reg-form-container">
                <div className="reg-section-title">Patient Information</div>

                <div className="form-grid">
                    {/* MR Number - First Field with Search */}
                    <div className="input-group mr-number-group">
                        <label>MR Number *</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                name="mrNumber"
                                value={formData.mrNumber}
                                onChange={handleChange}
                                placeholder="Enter MR Number (e.g., 123456)"
                                className="mr-input"
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={handleMRSearch}
                                className="btn-search-mr"
                                disabled={searching}
                            >
                                <Search size={16} />
                                {searching ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        {existingPatient && (
                            <span style={{ color: '#28a745', fontSize: '0.75rem', marginTop: '4px' }}>
                                ✓ Existing patient - Visit #{existingPatient.visit_count || 1 + 1}
                            </span>
                        )}
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

                    {/* Medical Alerts Section */}
                    <div className="input-group">
                        <label>Allergies (comma-separated)</label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="e.g., Penicillin, Sulfa drugs"
                        />
                    </div>

                    <div className="input-group">
                        <label>Known Conditions (comma-separated)</label>
                        <input
                            type="text"
                            name="conditions"
                            value={formData.conditions}
                            onChange={handleChange}
                            placeholder="e.g., Diabetic, Hypertension"
                        />
                    </div>

                    {/* Photo Column with Camera Capture */}
                    <div className="photo-section">
                        {showCamera ? (
                            <div className="camera-container">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="camera-video"
                                />
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                                <div className="camera-actions">
                                    <button type="button" className="btn-capture" onClick={capturePhoto}>
                                        <Camera size={16} /> Capture
                                    </button>
                                    <button type="button" className="btn-cancel-camera" onClick={stopCamera}>
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : photo ? (
                            <div className="photo-preview">
                                <img src={photo} alt="Patient" className="captured-photo" />
                                <button type="button" className="btn-remove-photo" onClick={removePhoto}>
                                    <X size={14} /> Remove
                                </button>
                            </div>
                        ) : (
                            <div className="photo-placeholder" onClick={startCamera}>
                                <div className="placeholder-content">
                                    <Camera size={32} />
                                    <div className="placeholder-text">Click to Capture Photo</div>
                                </div>
                            </div>
                        )}
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
