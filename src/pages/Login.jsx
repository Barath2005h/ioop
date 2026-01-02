import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, User } from 'lucide-react';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login for any input
        if (username) {
            navigate('/queue');
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                Aravind Eye Hospitals & PG Institute of Ophthalmology
            </div>

            <div className="login-content">
                <div className="login-card">
                    {/* Left Panel: Pearls */}
                    <div className="pearls-section">
                        <div className="pearls-header">
                            Ophthalmology pearls #43
                        </div>
                        <div className="pearls-content">
                            <div className="pearl-title">Punctate Staining Patterns of the Ocular Surface</div>
                            <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                <p><strong>Pattern:</strong> Diffuse</p>
                                <p><strong>Example:</strong> Viral conjunctivitis, Toxicity</p>
                                <br />
                                <p><strong>Pattern:</strong> Inferior</p>
                                <p><strong>Example:</strong> Blepharoconjunctivitis, Lagophthalmos</p>
                                <br />
                                <p><strong>Pattern:</strong> Interpalpebral</p>
                                <p><strong>Example:</strong> Dry eye disease, Exposure</p>

                                <div style={{ marginTop: '20px', padding: '10px', background: '#eef', borderRadius: '4px' }}>
                                    <em>Reference: BCSC 2022-23 External Disease and Cornea</em>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Login Form */}
                    <div className="login-form-section">
                        <div className="app-logo">
                            <Eye size={36} />
                            <span>eyeNotes</span>
                        </div>

                        <form onSubmit={handleLogin} style={{ width: '100%' }}>
                            <div className="form-group">
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#888' }} />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Username"
                                        style={{ paddingLeft: '35px' }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#888' }} />
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Password"
                                        style={{ paddingLeft: '35px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="login-btn">
                                Login
                            </button>

                            <div className="text-center or-divider">OR</div>

                            <button type="button" className="google-btn">
                                Login Using Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer-bar">
                v060824 | Copyright © 2018 EMR. All Rights Reserved.
            </div>
        </div>
    );
}
