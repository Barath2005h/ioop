const API_BASE_URL = 'http://localhost:5000/api';

// ============== PATIENT API ==============

export async function fetchPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients`);
        if (!response.ok) throw new Error('Failed to fetch patients');
        return await response.json();
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
}

export async function fetchPatientById(patientId) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch patient');
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient:', error);
        return null;
    }
}

export async function checkMRExists(mrNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/mr/${mrNumber}`);
        if (!response.ok) throw new Error('Failed to check MR number');
        return await response.json();
    } catch (error) {
        console.error('Error checking MR:', error);
        return { exists: false };
    }
}

export async function createPatient(patientData) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        if (!response.ok) throw new Error('Failed to create patient');
        return await response.json();
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
}

export async function updatePatient(patientId, patientData) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        if (!response.ok) throw new Error('Failed to update patient');
        return await response.json();
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
}

// ============== VISIT API ==============

export async function fetchVisitHistory(patientId) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits`);
        if (!response.ok) throw new Error('Failed to fetch visits');
        return await response.json();
    } catch (error) {
        console.error('Error fetching visits:', error);
        return [];
    }
}

export async function logVisit(patientId, visitData) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}/visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitData)
        });
        if (!response.ok) throw new Error('Failed to log visit');
        return await response.json();
    } catch (error) {
        console.error('Error logging visit:', error);
        throw error;
    }
}

// ============== MEDICAL ALERTS API ==============

export async function fetchMedicalAlerts(patientId) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}/alerts`);
        if (!response.ok) throw new Error('Failed to fetch alerts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
    }
}

export async function addMedicalAlert(patientId, alertData) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertData)
        });
        if (!response.ok) throw new Error('Failed to add alert');
        return await response.json();
    } catch (error) {
        console.error('Error adding alert:', error);
        throw error;
    }
}
