from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from librouteros import connect

app = Flask(__name__)
CORS(app)

# Konfigurasi Database (Gunakan Variabel Lingkungan)
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'admin')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'ali123')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'client')

# Konfigurasi MikroTik
MIKROTIK_HOST = os.getenv('MIKROTIK_HOST', '192.168.126.120')
MIKROTIK_USER = os.getenv('MIKROTIK_USER', 'admin')
MIKROTIK_PASS = os.getenv('MIKROTIK_PASS', '')
    
# Fungsi koneksi ke database
def get_db_connection():
    return mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )

@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        # Ambil data dari request
        data = request.json
        nama = data.get('nama')
        username = data.get('username')
        passwd = data.get('passwd')
        ip = data.get('ip')
        alamat = data.get('alamat')

        # Validasi input
        if not all([nama, username, passwd, ip, alamat]):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        # Koneksi ke database
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
            INSERT INTO users (nama, username, passwd, ip, alamat)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nama, username, passwd, ip, alamat))
            connection.commit()

        # Koneksi ke MikroTik
        try:
            api = connect(username=MIKROTIK_USER, password=MIKROTIK_PASS, host=MIKROTIK_HOST)

            # Tambahkan IP ke MikroTik
            api(cmd="/ip/address/add", address=f"{ip}/24", interface="ether2")
        except Exception as e:
            return jsonify({"message": f"Error saat menambahkan IP ke MikroTik: {str(e)}"}), 500

        return jsonify({"message": "Data berhasil ditambahkan!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500

@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id, nama, username, ip, alamat FROM users")
            users = cursor.fetchall()

        return jsonify(users), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
