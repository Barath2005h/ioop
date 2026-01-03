import pymysql
from config import config

def get_connection():
    """Get a database connection"""
    return pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        database=config.DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def init_database():
    """Initialize the database and create tables"""
    # First connect without database to create it if needed
    conn = pymysql.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        charset='utf8mb4'
    )
    
    try:
        with conn.cursor() as cursor:
            # Create database if not exists
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {config.DB_NAME}")
            cursor.execute(f"USE {config.DB_NAME}")
            
            # Create patients table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS patients (
                    id VARCHAR(20) PRIMARY KEY,
                    mr_number VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    parent_info VARCHAR(255),
                    age INT,
                    gender VARCHAR(20),
                    dob DATE,
                    mobile VARCHAR(20),
                    city VARCHAR(100),
                    state VARCHAR(100),
                    photo LONGTEXT,
                    purpose VARCHAR(255),
                    visit_type VARCHAR(10) DEFAULT 'N',
                    allergies TEXT,
                    conditions TEXT,
                    assigned_to VARCHAR(255) DEFAULT 'Unassigned',
                    last_visit_date DATE,
                    last_clinic VARCHAR(100),
                    status VARCHAR(50) DEFAULT 'Waiting',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            """)
            
            # Create visits table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS visits (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id VARCHAR(20) NOT NULL,
                    visit_date DATE NOT NULL,
                    visit_time TIME,
                    visit_type VARCHAR(10),
                    purpose VARCHAR(255),
                    clinic VARCHAR(100),
                    location VARCHAR(100),
                    has_investigation BOOLEAN DEFAULT FALSE,
                    has_refraction BOOLEAN DEFAULT FALSE,
                    has_glaucoma BOOLEAN DEFAULT FALSE,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
                )
            """)
            
            # Create medical_alerts table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS medical_alerts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id VARCHAR(20) NOT NULL,
                    alert_type VARCHAR(50) NOT NULL,
                    alert_value VARCHAR(255) NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
                )
            """)
            
            # Create emr_records table for storing all EMR section data
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS emr_records (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id VARCHAR(20) NOT NULL,
                    visit_id INT,
                    section_type VARCHAR(50) NOT NULL,
                    data JSON NOT NULL,
                    created_by VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_patient_section (patient_id, section_type)
                )
            """)
            
            conn.commit()
            print("Database and tables created successfully!")
            
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()
