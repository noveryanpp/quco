from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import paramiko

app = Flask(__name__)
CORS(app)

# database
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'admin')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'ali123')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'client')

# mikroTik
MIKROTIK_HOST = os.getenv('MIKROTIK_HOST', '192.168.126.120')
MIKROTIK_USER = os.getenv('MIKROTIK_USER', 'admin')
MIKROTIK_PASS = os.getenv('MIKROTIK_PASS', '')
    
# koneksi ke database
def get_db_connection():
    return mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )

# koneksi ke MikroTik via Paramiko
def connect_to_mikrotik():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(MIKROTIK_HOST, username=MIKROTIK_USER, password=MIKROTIK_PASS)

        return ssh
    except Exception as e:
        raise Exception(f"Error connecting to MikroTik: {e}")

# tambah IP ke MikroTik
def add_ip_to_mikrotik(ip):
    try:
        ssh = connect_to_mikrotik()
        command = f"/ip/address/add address={ip}/24 interface=ether2"
        stdin, stdout, stderr = ssh.exec_command(command)
        stdout.channel.recv_exit_status()
        ssh.close()
    except Exception as e:
        raise Exception(f"Error adding IP to MikroTik: {e}")

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

        if not all([nama, username, passwd, ip, alamat]):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
            INSERT INTO users (nama, username, passwd, ip, alamat)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nama, username, passwd, ip, alamat))
            connection.commit()

        # Koneksi ke MikroTik dan tambahkan IP
        add_ip_to_mikrotik(ip)

        return jsonify({"message": "Data berhasil ditambahkan!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500
    except Exception as e:
        return jsonify({"message": str(e)}), 500

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
