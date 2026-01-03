export const patients = [
    {
        id: 'P758184',
        mrNumber: '758184',
        name: 'Hari Prasad',
        parentInfo: 'S/O Ravi Kumar',
        age: 35,
        gender: 'Male',
        city: 'Chennai',
        state: 'Tamil Nadu',
        visitType: 'R', // Review
        hospitalRegTime: '07:51 AM',
        clinicalInTime: '07:51 AM',
        checkInTimestamp: Date.now() - (2 * 60 + 22) * 60 * 1000, // 2 hrs 22 mins ago
        purpose: 'Post Surgical Followup In Retina Clinic',
        assignedTo: 'Sivadarshan / -',
        lastVisit: '05/08/2024, RETINA CLINIC',
        lastVisitDate: '11/12/2025',
        lastClinic: 'RETINA CLINIC',
        status: 'Waiting',
        allergies: 'Penicillin',
        conditions: 'Diabetic',
        visitHistory: [
            { id: 23, date: '16-Dec-25', location: 'CHN', type: 'Inv', hasInvestigation: true, hasGlaucoma: true },
            { id: 22, date: '06-Nov-25', location: 'CHN', type: 'Rx', hasRefraction: true, hasGlaucoma: true },
            { id: 21, date: '22-Jul-25', location: 'CHN', type: 'Gla', hasGlaucoma: true },
            { id: 20, date: '29-Jan-25', location: 'CHN', type: 'Rx', hasRefraction: true, hasGlaucoma: true },
            { id: 19, date: '22-Oct-24', location: 'CHN', type: 'Inv', hasInvestigation: true, hasGlaucoma: true }
        ],
        history: {
            diagnosis: ['BE Corneal foreign Body', 'BE Immature cataract', 'BE Posterior capsular opacification'],
            advice: 'Surgery'
        }
    },
    {
        id: 'P992831',
        mrNumber: '992831',
        name: 'Avik Dey Sarkar',
        parentInfo: 'S/O Pradip Sarkar',
        age: 16,
        gender: 'Male',
        city: 'Madurai',
        state: 'Tamil Nadu',
        visitType: 'R',
        hospitalRegTime: '08:10 AM',
        clinicalInTime: '08:10 AM',
        checkInTimestamp: Date.now() - (1 * 60 + 45) * 60 * 1000, // 1 hr 45 mins ago
        purpose: 'Post Surgical Followup In Retina Clinic',
        assignedTo: 'Avik Dey Sarkar / -',
        lastVisit: '31/07/2024, RETINA CLINIC',
        lastVisitDate: '31/07/2024',
        lastClinic: 'RETINA CLINIC',
        status: 'Waiting',
        allergies: '',
        conditions: '',
        visitHistory: [
            { id: 5, date: '10-Dec-25', location: 'CHN', type: 'Gla', hasGlaucoma: true },
            { id: 4, date: '15-Sep-25', location: 'CHN', type: 'Rx', hasRefraction: true },
            { id: 3, date: '01-Aug-25', location: 'CHN', type: 'Inv', hasInvestigation: true }
        ],
        history: {}
    },
    {
        id: 'P112233',
        mrNumber: '112233',
        name: 'Chakram Priyalaxmi',
        parentInfo: 'D/O Venkat Rao',
        age: 51,
        gender: 'Female',
        city: 'Trichy',
        state: 'Tamil Nadu',
        visitType: 'R',
        hospitalRegTime: '08:43 AM',
        clinicalInTime: '08:43 AM',
        checkInTimestamp: Date.now() - (2 * 60 + 28) * 60 * 1000, // 2 hrs 28 mins ago
        purpose: 'Post Surgical Followup In Retina Clinic',
        assignedTo: 'Chakram Priyalaxmi / -',
        lastVisit: '01/08/2024, RETINA CLINIC',
        lastVisitDate: '01/08/2024',
        lastClinic: 'RETINA CLINIC',
        status: 'Waiting',
        allergies: 'Sulfa drugs',
        conditions: 'Hypertension',
        visitHistory: [
            { id: 12, date: '20-Dec-25', location: 'CHN', type: 'Gla', hasGlaucoma: true },
            { id: 11, date: '18-Nov-25', location: 'CHN', type: 'Rx', hasRefraction: true, hasGlaucoma: true }
        ],
        history: {}
    }
];
