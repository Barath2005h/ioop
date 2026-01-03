from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection, init_database
from config import config
from datetime import datetime, date
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Helper function to serialize dates
def serialize_patient(patient):
    if patient is None:
        return None
    result = dict(patient)
    for key, value in result.items():
        if isinstance(value, (datetime, date)):
            result[key] = value.isoformat()
    return result

# ============== PATIENT ENDPOINTS ==============

@app.route('/api/patients', methods=['GET'])
def get_all_patients():
    """Get all patients"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, 
                       (SELECT COUNT(*) FROM visits WHERE patient_id = p.id) as visit_count
                FROM patients p
                ORDER BY p.created_at DESC
            """)
            patients = cursor.fetchall()
        conn.close()
        return jsonify([serialize_patient(p) for p in patients])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get a single patient by ID"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, 
                       (SELECT COUNT(*) FROM visits WHERE patient_id = p.id) as visit_count
                FROM patients p
                WHERE p.id = %s
            """, (patient_id,))
            patient = cursor.fetchone()
            
            if patient:
                # Get visit history
                cursor.execute("""
                    SELECT * FROM visits 
                    WHERE patient_id = %s 
                    ORDER BY visit_date DESC, visit_time DESC
                """, (patient_id,))
                visits = cursor.fetchall()
                patient['visitHistory'] = [serialize_patient(v) for v in visits]
                
                # Get medical alerts
                cursor.execute("""
                    SELECT * FROM medical_alerts
                    WHERE patient_id = %s AND is_active = TRUE
                """, (patient_id,))
                alerts = cursor.fetchall()
                patient['medicalAlerts'] = alerts
                
        conn.close()
        
        if patient:
            return jsonify(serialize_patient(patient))
        return jsonify({'error': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/mr/<mr_number>', methods=['GET'])
def get_patient_by_mr(mr_number):
    """Check if patient exists by MR number"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, 
                       (SELECT COUNT(*) FROM visits WHERE patient_id = p.id) as visit_count
                FROM patients p
                WHERE p.mr_number = %s
            """, (mr_number,))
            patient = cursor.fetchone()
            
            if patient:
                # Get visit history
                cursor.execute("""
                    SELECT * FROM visits 
                    WHERE patient_id = %s 
                    ORDER BY visit_date DESC, visit_time DESC
                """, (patient['id'],))
                visits = cursor.fetchall()
                patient['visitHistory'] = [serialize_patient(v) for v in visits]
                
                # Get medical alerts
                cursor.execute("""
                    SELECT * FROM medical_alerts
                    WHERE patient_id = %s AND is_active = TRUE
                """, (patient['id'],))
                alerts = cursor.fetchall()
                patient['medicalAlerts'] = alerts
                
        conn.close()
        
        if patient:
            return jsonify({'exists': True, 'patient': serialize_patient(patient)})
        return jsonify({'exists': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['POST'])
def create_patient():
    """Create a new patient"""
    try:
        data = request.json
        patient_id = f"P{int(datetime.now().timestamp() * 1000) % 1000000}"
        
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO patients (
                    id, mr_number, name, parent_info, age, gender, dob, 
                    mobile, city, state, photo, purpose, visit_type,
                    allergies, conditions, assigned_to, status
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
            """, (
                patient_id,
                data.get('mrNumber'),
                data.get('name'),
                data.get('parentInfo'),
                data.get('age'),
                data.get('gender'),
                data.get('dob') or None,
                data.get('mobile'),
                data.get('city'),
                data.get('state'),
                data.get('photo'),
                data.get('purpose'),
                data.get('visitType', 'N'),
                data.get('allergies'),
                data.get('conditions'),
                data.get('assignedTo', 'Unassigned'),
                data.get('status', 'Waiting')
            ))
            
            # Create initial visit record
            cursor.execute("""
                INSERT INTO visits (patient_id, visit_date, visit_time, visit_type, purpose, clinic, location)
                VALUES (%s, CURDATE(), CURTIME(), %s, %s, %s, %s)
            """, (
                patient_id,
                data.get('visitType', 'N'),
                data.get('purpose'),
                data.get('clinic', 'CHN'),
                data.get('location', 'Chennai')
            ))
            
            # Add medical alerts if provided
            if data.get('allergies'):
                for allergy in data.get('allergies', '').split(','):
                    if allergy.strip():
                        cursor.execute("""
                            INSERT INTO medical_alerts (patient_id, alert_type, alert_value)
                            VALUES (%s, 'allergy', %s)
                        """, (patient_id, allergy.strip()))
            
            if data.get('conditions'):
                for condition in data.get('conditions', '').split(','):
                    if condition.strip():
                        cursor.execute("""
                            INSERT INTO medical_alerts (patient_id, alert_type, alert_value)
                            VALUES (%s, 'condition', %s)
                        """, (patient_id, condition.strip()))
            
            conn.commit()
        conn.close()
        
        return jsonify({'id': patient_id, 'message': 'Patient created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """Update a patient"""
    try:
        data = request.json
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE patients SET
                    name = %s, parent_info = %s, age = %s, gender = %s,
                    dob = %s, mobile = %s, city = %s, state = %s,
                    photo = %s, purpose = %s, visit_type = %s,
                    allergies = %s, conditions = %s, assigned_to = %s, status = %s
                WHERE id = %s
            """, (
                data.get('name'),
                data.get('parentInfo'),
                data.get('age'),
                data.get('gender'),
                data.get('dob') or None,
                data.get('mobile'),
                data.get('city'),
                data.get('state'),
                data.get('photo'),
                data.get('purpose'),
                data.get('visitType'),
                data.get('allergies'),
                data.get('conditions'),
                data.get('assignedTo'),
                data.get('status'),
                patient_id
            ))
            conn.commit()
        conn.close()
        
        return jsonify({'message': 'Patient updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== VISIT ENDPOINTS ==============

@app.route('/api/patients/<patient_id>/visits', methods=['GET'])
def get_patient_visits(patient_id):
    """Get all visits for a patient"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM visits 
                WHERE patient_id = %s 
                ORDER BY visit_date DESC, visit_time DESC
            """, (patient_id,))
            visits = cursor.fetchall()
        conn.close()
        return jsonify([serialize_patient(v) for v in visits])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>/visits', methods=['POST'])
def create_visit(patient_id):
    """Log a new visit for a patient"""
    try:
        data = request.json
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO visits (
                    patient_id, visit_date, visit_time, visit_type, purpose,
                    clinic, location, has_investigation, has_refraction, has_glaucoma, notes
                ) VALUES (%s, CURDATE(), CURTIME(), %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                patient_id,
                data.get('visitType', 'R'),
                data.get('purpose'),
                data.get('clinic', 'CHN'),
                data.get('location', 'Chennai'),
                data.get('hasInvestigation', False),
                data.get('hasRefraction', False),
                data.get('hasGlaucoma', False),
                data.get('notes')
            ))
            
            # Update patient's last visit info
            cursor.execute("""
                UPDATE patients SET
                    last_visit_date = CURDATE(),
                    last_clinic = %s,
                    visit_type = 'R'
                WHERE id = %s
            """, (data.get('clinic', 'CHN'), patient_id))
            
            conn.commit()
        conn.close()
        
        return jsonify({'message': 'Visit logged successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== MEDICAL ALERTS ENDPOINTS ==============

@app.route('/api/patients/<patient_id>/alerts', methods=['GET'])
def get_patient_alerts(patient_id):
    """Get medical alerts for a patient"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM medical_alerts
                WHERE patient_id = %s AND is_active = TRUE
            """, (patient_id,))
            alerts = cursor.fetchall()
        conn.close()
        return jsonify(alerts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>/alerts', methods=['POST'])
def add_patient_alert(patient_id):
    """Add a medical alert for a patient"""
    try:
        data = request.json
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO medical_alerts (patient_id, alert_type, alert_value)
                VALUES (%s, %s, %s)
            """, (patient_id, data.get('alertType'), data.get('alertValue')))
            conn.commit()
        conn.close()
        return jsonify({'message': 'Alert added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== EMR RECORDS ENDPOINTS ==============

@app.route('/api/patients/<patient_id>/emr', methods=['GET'])
def get_all_emr_records(patient_id):
    """Get all EMR records for a patient"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM emr_records
                WHERE patient_id = %s
            """, (patient_id,))
            records = cursor.fetchall()
        conn.close()
        
        # Convert to a dict keyed by section_type
        result = {}
        for record in records:
            section = record['section_type']
            # Parse JSON data
            data = record['data']
            if isinstance(data, str):
                import json as json_module
                data = json_module.loads(data)
            result[section] = {
                'id': record['id'],
                'data': data,
                'created_at': record['created_at'].isoformat() if record['created_at'] else None,
                'updated_at': record['updated_at'].isoformat() if record['updated_at'] else None,
                'created_by': record['created_by']
            }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>/emr/<section_type>', methods=['GET'])
def get_emr_record(patient_id, section_type):
    """Get EMR record for a specific section"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM emr_records
                WHERE patient_id = %s AND section_type = %s
            """, (patient_id, section_type))
            record = cursor.fetchone()
        conn.close()
        
        if record:
            data = record['data']
            if isinstance(data, str):
                import json as json_module
                data = json_module.loads(data)
            return jsonify({
                'exists': True,
                'id': record['id'],
                'data': data,
                'created_at': record['created_at'].isoformat() if record['created_at'] else None,
                'updated_at': record['updated_at'].isoformat() if record['updated_at'] else None,
                'created_by': record['created_by']
            })
        return jsonify({'exists': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>/emr/<section_type>', methods=['POST'])
def save_emr_record(patient_id, section_type):
    """Save or update EMR record for a section"""
    try:
        data = request.json
        conn = get_connection()
        with conn.cursor() as cursor:
            # Use INSERT ... ON DUPLICATE KEY UPDATE for upsert
            cursor.execute("""
                INSERT INTO emr_records (patient_id, section_type, data, created_by)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    data = VALUES(data),
                    updated_at = CURRENT_TIMESTAMP
            """, (
                patient_id,
                section_type,
                json.dumps(data.get('data', {})),
                data.get('createdBy', 'Dr. Chris Diana Pius')
            ))
            conn.commit()
        conn.close()
        return jsonify({'message': 'EMR record saved successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>/emr/<section_type>', methods=['DELETE'])
def delete_emr_record(patient_id, section_type):
    """Delete EMR record for a section"""
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                DELETE FROM emr_records
                WHERE patient_id = %s AND section_type = %s
            """, (patient_id, section_type))
            conn.commit()
        conn.close()
        return jsonify({'message': 'EMR record deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============== STARTUP ==============

if __name__ == '__main__':
    print("Initializing database...")
    init_database()
    print(f"Starting Flask server on port {config.FLASK_PORT}...")
    app.run(host='0.0.0.0', port=config.FLASK_PORT, debug=config.FLASK_DEBUG)

