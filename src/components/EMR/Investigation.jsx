import React from 'react';
import './Investigation.css';

export default function Investigation({ patient }) {
    const investigations = [
        {
            name: 'IOP',
            reValue: '18 mm of Hg by Applanation',
            leValue: '16 mm of Hg by Applanation',
            dateTime: '16 Dec 2025 05:37 PM'
        },
        {
            name: 'Blood Pressure',
            reValue: '140 / 80 mm Hg',
            leValue: '',
            dateTime: '16 Dec 2025 01:02 PM'
        },
        {
            name: 'K Reading',
            reValue: 'K1: 43.00 D @ 110°\nK2: 44.75 D @ 20°\nCyl 01.75 D @ 20°\nAxis: Against Rule Astigmatism',
            leValue: 'K1: 43.00 D @ 75°\nK2: 44.50 D @ 165°\nCyl 01.50 D @ 165°\nAxis: Against Rule Astigmatism',
            dateTime: '16 Dec 2025 01:12 PM'
        }
    ];

    return (
        <div className="investigation-section">
            <h2 className="section-title">Investigation</h2>

            <table className="investigation-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Investigation Name</th>
                        <th>RE Values</th>
                        <th>LE Values</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {investigations.map((inv, idx) => (
                        <tr key={idx}>
                            <td className="icon-cell">
                                <span className="add-icon">➕</span>
                                <span className="info-icon">ℹ️</span>
                            </td>
                            <td className="name-cell">{inv.name}</td>
                            <td className="value-cell">{inv.reValue}</td>
                            <td className="value-cell">{inv.leValue || '—'}</td>
                            <td className="date-cell">{inv.dateTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="dilation-section">
                <h3>Dilation</h3>
            </div>
        </div>
    );
}
