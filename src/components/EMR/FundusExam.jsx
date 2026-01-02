import React from 'react';
import './FundusExam.css';

export default function FundusExam({ patient }) {
    const examData = [
        { label: 'Media', re: 'Clear', le: 'Clear' },
        { label: 'Disc', re: 'cdr 0.9,bipolar notch, PPA', le: 'cdr 0.9,bipolar notch, PPA', highlight: true },
        { label: 'Vessels', re: 'Normal', le: 'Normal' },
        { label: 'Background Retina', re: 'Normal', le: 'Normal' },
        { label: 'Macula/Foveal Reflex', re: 'Present', le: 'Present' },
        { label: 'Eye Drawing', re: '', le: '' }
    ];

    return (
        <div className="fundus-section">
            <h2 className="section-title">Fundus Exam</h2>
            <p className="doctor-info">Dr. Chris Diana Pius, 16 Dec 2025 05:07 PM (GLAUCOMA CLINIC, CHN)</p>

            <div className="exam-grid">
                <div className="grid-header">
                    <span></span>
                    <span className="re-header">Right Eye</span>
                    <span className="le-header">Left Eye</span>
                </div>
                {examData.map((item, idx) => (
                    <div key={idx} className={`grid-row ${item.highlight ? 'highlight' : ''}`}>
                        <span className="label">{item.label}</span>
                        <span className="re-value">{item.re}</span>
                        <span className="le-value">{item.le}</span>
                    </div>
                ))}
            </div>

            {/* Special Investigation */}
            <div className="special-investigation">
                <h3>Special Investigation</h3>
                <table className="special-table">
                    <thead>
                        <tr>
                            <th>Investigation Name</th>
                            <th>RE Values</th>
                            <th>LE Values</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Perimetry</td>
                            <td>Completed</td>
                            <td>Completed</td>
                            <td>16 Dec 2025 04:17 PM</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
