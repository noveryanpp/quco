from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import mysql.connector
import os
import paramiko

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database Configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'admin')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'ali123')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'client')

# MikroTik Configuration
MIKROTIK_HOST = os.getenv('MIKROTIK_HOST', '192.168.126.120')
MIKROTIK_USER = os.getenv('MIKROTIK_USER', 'admin')
MIKROTIK_PASS = os.getenv('MIKROTIK_PASS', '')

# Koneksi ke Database
def get_db_connection():
    return mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )

# Koneksi ke MikroTik via Paramiko
def connect_to_mikrotik():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(MIKROTIK_HOST, username=MIKROTIK_USER, password=MIKROTIK_PASS)
        return ssh
    except Exception as e:
        raise Exception(f"Error connecting to MikroTik: {e}")

# Tambah IP ke MikroTik
def add_ip_to_mikrotik(ip):
    try:
        ssh = connect_to_mikrotik()
        command = f"/ip/address/add address={ip}/24 interface=ether2"
        stdin, stdout, stderr = ssh.exec_command(command)
        stdout.channel.recv_exit_status()
        ssh.close()
    except Exception as e:
        raise Exception(f"Error adding IP to MikroTik: {e}")

#@app.route('/change_ssid', methods=['POST'])
#def change_ssid():
 #   try:

#@app.route('/change_passwd', methods=['POST'])
#def change_passwd():

#@app.route('/set_dns', methods=['POST'])
#def set_dns():

#@app.route('/set_channel', methods=['POST'])
#def set_channel():

#@app.route('/show_connection', methods=['GET'])
#def show_connection():

#
#

# Tambah User
@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        data = request.json
        nama = data.get('nama')
        username = data.get('username')
        passwd = data.get('passwd')
        ip = data.get('ip')
        alamat = data.get('alamat')
        notelp = data.get('notelp')

        if not all([nama, username, passwd, ip, alamat, notelp]):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO users (nama, username, passwd, ip, alamat, notelp)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nama, username, passwd, ip, alamat, notelp))
            connection.commit()

        return jsonify({"message": "Data berhasil ditambahkan!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get User
@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
        return jsonify(users), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500

# Update User
@app.route('/update_user/<int:user_id>', methods=['PUT'])
def update_users(user_id):
    try:
        data = request.json
        connection = get_db_connection()

        with connection.cursor() as cursor:
            sql = """
                UPDATE users 
                SET nama=%s, username=%s, passwd=%s, ip=%s, alamat=%s, notelp=%s 
                WHERE id=%s
            """
            values = (data['nama'], data['username'], data['passwd'], data['ip'], data['alamat'], data['notelp'], user_id)
            cursor.execute(sql, values)
            connection.commit()

            socketio.emit('update_user')

        return jsonify({"message": "User berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500

# Delete User
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        connection = get_db_connection()
        
        with connection.cursor() as cursor:
            sql = "DELETE FROM users WHERE id=%s"
            cursor.execute(sql, (user_id,))
            connection.commit()
            
            socketio.emit('delete_user')
        
        return jsonify({"message": "User berhasil dihapus!"}), 200
    
    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500

# Tambah PAket
@app.route('/add_paket', methods=['POST'])
def add_paket():
    try:
        data = request.json
        nama = data.get('nama')
        kecepatan = data.get('kecepatan')
        harga = data.get('harga')
        masa_aktif = data.get('masa_aktif')

        if not all([nama, kecepatan, harga, masa_aktif]):
            return jsonify({"message": "Wajib diisi"}), 400

        connection = get_db_connection()

        with connection.cursor() as cursor:
            query = """INSERT INTO paket (nama, kecepatan, harga, masa_aktif) 
                       VALUES (%s, %s, %s, %s)"""
            cursor.execute(query, (nama, kecepatan, harga, masa_aktif))
            connection.commit()

        return jsonify({"message": "Success added"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"}), 500

# Get Paket
@app.route('/get_paket', methods=['GET'])
def get_paket():
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM paket")
            paket = cursor.fetchall()
        return jsonify(paket), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500

# Update Paket
@app.route('/update_paket/<int:paket_id>', methods=['PUT'])
def update_paket(paket_id):
    try:
        data = request.json
        connection = get_db_connection()

        with connection.cursor() as cursor:
            sql = """
                UPDATE paket 
                SET nama=%s, kecepatan=%s, harga=%s, masa_aktif=%s
                WHERE id=%s
            """
            values = (data['nama'], data['kecepatan'], data['harga'], data['masa_aktif'], paket_id)
            
            cursor.execute(sql, values)
            connection.commit()

            socketio.emit('update_paket')

        return jsonify({"message": "Paket berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:

        return jsonify({"message": f"Error Database: {err}"}), 500

# Delete Paket
@app.route('/delete_paket/<int:paket_id>', methods=['DELETE'])
def delete_paket(paket_id):
    try:
        connection = get_db_connection()
        
        with connection.cursor() as cursor:
            sql = "DELETE FROM paket WHERE id=%s"
            cursor.execute(sql, (paket_id,))
            connection.commit()
            
            socketio.emit('delete_paket')
        
        return jsonify({"message": "Paket berhasil dihapus!"}), 200
    
    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500

# Jalankan Flask
if __name__ == '__main__':
    app.run(debug=True)