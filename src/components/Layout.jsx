import React from 'react';
import { ChevronRight, ChevronDown, Printer } from 'lucide-react';
import './Layout.css';

export default function Layout({ children, activeSection, onSectionChange, expandedSections, onToggleSection }) {
    const sections = [
        { title: 'Complaints', items: [] },
        { title: 'Any Vulnerabilities', items: [] },
        { title: 'Initial Assessment', items: ['Vision', 'Nutritional Assess', 'History', 'Refraction', 'Refraction - Others', 'Investigation', 'Anaesthesia', 'Ant. Segment Exam'] },
        { title: 'Dilation', items: ['Dilation'] },
        { title: 'Fundus Exam', items: [] },
        { title: 'Care Plan', items: ['Special Investigations', 'General Anaesthesia'] },
        { title: 'Diagnosis', items: ['Diagnosis'] }
    ];

    const handleItemClick = (item) => {
        if (onSectionChange) onSectionChange(item);
    };

    const handleToggle = (title) => {
        if (onToggleSection) onToggleSection(title);
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <div className="layout-sidebar">
                <div className="sidebar-toggle-dots">
                    <span className="dot active"></span>
                    <span className="dot"></span>
                </div>

                <div className="sidebar-menu">
                    {sections.map(sec => (
                        <div key={sec.title} className="menu-section">
                            <div
                                className={`menu-header ${sec.items.length === 0 ? 'no-items' : ''} ${activeSection === sec.title ? 'active' : ''}`}
                                onClick={() => {
                                    if (sec.items.length > 0) handleToggle(sec.title);
                                    else handleItemClick(sec.title);
                                }}
                            >
                                <span className="menu-title">{sec.title}</span>
                                {sec.items.length > 0 && (
                                    <span className="expand-icon">
                                        {expandedSections?.[sec.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </span>
                                )}
                            </div>
                            {sec.items.length > 0 && expandedSections?.[sec.title] && (
                                <div className="menu-items">
                                    {sec.items.map(item => (
                                        <div
                                            key={item}
                                            className={`menu-item ${activeSection === item ? 'active' : ''}`}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            <span>
                                                <ChevronRight size={10} className="item-chevron" />
                                                {item}
                                            </span>
                                            {['Vision', 'Nutritional Assess', 'Refraction', 'Dilation'].includes(item) && (
                                                <span className="badge-new">NEW</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="sidebar-actions">
                    <button className="btn-next-station">Next Station</button>
                    <button className="btn-print">
                        <Printer size={12} />
                        Print Summary
                        <span className="print-badge">0</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="layout-main">
                {children}
            </div>
        </div>
    );
}
