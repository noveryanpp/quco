import mysql.connector
from dotenv import load_dotenv
import os
import paramiko
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from pathlib import Path
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

import paramiko.client

dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
# atur login
@app.route('/add_admin', methods=['POST'])
def add_admin():
    try:
        data = request.json
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not all([name, username, password, email]):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO admin (name, username, password, email)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (name, username, password, email))
            connection.commit()

        return jsonify({"message": "Admin berhasil ditambahkan!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error database: {err}"}), 500
    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Edit Name
@app.route('/update_name', methods=['PUT'])
@jwt_required()
def update_name():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_name = data.get('new_name')

        if not new_name:
            return jsonify({"message": "Nama baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update nama berdasarkan username yang sedang login
            update_query = "UPDATE users SET name = %s WHERE username = %s"
            cursor.execute(update_query, (new_name, current_username))
            connection.commit()

        return jsonify({"message": "Nama berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500

# Edit username
@app.route('/update_username', methods=['PUT'])
@jwt_required()
def update_username():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_username = data.get('new_username')

        if not new_username:
            return jsonify({"message": "Username baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Cek apakah username baru sudah dipakai
            query_check = "SELECT username FROM users WHERE username = %s"
            cursor.execute(query_check, (new_username,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({"message": "Username sudah digunakan!"}), 400

            # Update username
            update_query = "UPDATE users SET username = %s WHERE username = %s"
            cursor.execute(update_query, (new_username, current_username))
            connection.commit()

        return jsonify({"message": "Username berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500

# Edit Password
@app.route('/update_password', methods=['PUT'])
@jwt_required()
def update_password():
    try:
        data = request.json
        username = get_jwt_identity()  # Ambil username dari token JWT
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if not old_password or not new_password:
            return jsonify({"message": "Password lama dan baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Cek apakah password lama cocok
            query = "SELECT password FROM users WHERE username = %s"
            cursor.execute(query, (username,))
            user = cursor.fetchone()

            if not user or user[0] != old_password:
                return jsonify({"message": "Password lama salah!"}), 401

            # Update password baru
            update_query = "UPDATE users SET password = %s WHERE username = %s"
            cursor.execute(update_query, (new_password, username))
            connection.commit()

        return jsonify({"message": "Password berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500
# Edit ip 
@app.route('/update_ip', methods=['PUT'])
@jwt_required()
def update_ip():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_ip = data.get('new_ip')

        if not new_ip:
            return jsonify({"message": "IP baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update IP berdasarkan username yang sedang login
            update_query = "UPDATE users SET ip = %s WHERE username = %s"
            cursor.execute(update_query, (new_ip, current_username))
            connection.commit()

        return jsonify({"message": "IP berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500
# Edit Mac
@app.route('/update_mac', methods=['PUT'])
@jwt_required()
def update_mac():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_mac = data.get('new_mac')

        if not new_mac:
            return jsonify({"message": "MAC Address baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update MAC Address berdasarkan username yang sedang login
            update_query = "UPDATE users SET mac = %s WHERE username = %s"
            cursor.execute(update_query, (new_mac, current_username))
            connection.commit()

        return jsonify({"message": "MAC Address berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500
# Edit Address
@app.route('/update_address', methods=['PUT'])
@jwt_required()
def update_address():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_address = data.get('new_address')

        if not new_address:
            return jsonify({"message": "Address baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update Address berdasarkan username yang sedang login
            update_query = "UPDATE users SET address = %s WHERE username = %s"
            cursor.execute(update_query, (new_address, current_username))
            connection.commit()

        return jsonify({"message": "Address berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500
# Edit Phone
@app.route('/update_phone', methods=['PUT'])
@jwt_required()
def update_phone():
    try:
        data = request.json
        current_username = get_jwt_identity()  # Ambil username dari token JWT
        new_phone = data.get('new_phone')

        if not new_phone:
            return jsonify({"message": "Nomor telepon baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update Phone berdasarkan username yang sedang login
            update_query = "UPDATE users SET phone = %s WHERE username = %s"
            cursor.execute(update_query, (new_phone, current_username))
            connection.commit()

        return jsonify({"message": "Nomor telepon berhasil diperbarui!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error Database: {err}"}), 500
 
# Database Configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

# MikroTik Configuration
MIKROTIK_HOST = os.getenv('MIKROTIK_HOST')
MIKROTIK_USER = os.getenv('MIKROTIK_USER')
MIKROTIK_PASS = os.getenv('MIKROTIK_PASS')

def get_db_connection():
    return mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )
    
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager(app)

@app.route("/admin/login", methods=["POST"])
def adminLogin():
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()
    with connection.cursor() as cursor:
        query = "SELECT * FROM admin WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

    if not user:
        return jsonify({"msg": "Username atau password salah!"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route("/auth/login", methods=["POST"])
def login():
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()
    with connection.cursor() as cursor:
        query = "SELECT * FROM users WHERE username = %s AND passwd = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

    if not user:
        return jsonify({"msg": "Username atau password salah!"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
    
def runAdminCommand(command):
    try:
        client = paramiko.client.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(MIKROTIK_HOST, username=MIKROTIK_USER, password=MIKROTIK_PASS)
        _stdin, _stdout,_stderr = client.exec_command(command)
        output = _stdout.read().decode()
        client.close()
        
        return output

    except Exception as e:
        return {"error": str(e)}
    
@app.route('/add_user', methods=['POST'])
def add_user():
    try:
        data = request.json
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')
        ip = data.get('ip')
        mac = data.get('mac')
        address = data.get('address')
        phone = data.get('phone')

        if not all([name, username, password, ip, address, phone]):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO users (name, username, password, ip, address, phone)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (name, username, password, ip, address, phone))
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
                SET name=%s, username=%s, password=%s, ip=%s, address=%s, phone=%s 
                WHERE id=%s
            """
            values = (data['name'], data['username'], data['password'], data['ip'], data['address'], data['phone'], user_id)
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
        name = data.get('name')
        kecepatan = data.get('kecepatan')
        harga = data.get('harga')
        masa_aktif = data.get('masa_aktif')

        if not all([name, kecepatan, harga, masa_aktif]):
            return jsonify({"message": "Wajib diisi"}), 400

        connection = get_db_connection()

        with connection.cursor() as cursor:
            query = """INSERT INTO paket (name, kecepatan, harga, masa_aktif) 
                       VALUES (%s, %s, %s, %s)"""
            cursor.execute(query, (name, kecepatan, harga, masa_aktif))
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
                SET name=%s, kecepatan=%s, harga=%s, masa_aktif=%s
                WHERE id=%s
            """
            values = (data['name'], data['kecepatan'], data['harga'], data['masa_aktif'], paket_id)
            
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
    
    
    
    
    

def runCommand(command):
    host = "192.168.1.10"
    username = "admin"
    password = "123"

    try: 
        client = paramiko.client.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=username, password=password)
        _stdin, _stdout,_stderr = client.exec_command(command)
        output = _stdout.read().decode()
        client.close()
        
        return output

    except Exception as e:
        return {"error": str(e)}
    
def parseOutput(response, type):
    lines = response.strip().split("\n")
    result = []
    
    match type:
        case "ipget":
            headers = lines[1].split()

            for line in lines[2:]:
                values = line.split()
                result.append(dict(zip(headers, values)))
            
        case "wlanget":
            headers = lines[1].split()
            headers.insert(1, "FLAG")
            total = 0

            for line in lines[2:]: 
                values = line.split()
                result.append(dict(zip(headers, values)))
                total += 1
                
            result.append({"total" : total})
            
        case "dnsget":
            res = {}
            for line in lines:
                key, value = line.split(":", 1)
                res[key.strip()] = value.strip()
                
            result.append(res)
            
        case "securityget":
            res = {}
            for line in lines[1:]:
                key, value = line.split("=", 1)
                res[key.strip()] = value.strip()
                
            result.append(res)
                
    return result

# get route
@app.route('/api/mikrotik/ip/get')
def ipGet():
    command = "ip address print"
    response = runCommand(command)
    parsedResponse = parseOutput(response, "ipget")
    return jsonify(parsedResponse)

@app.route('/api/mikrotik/dns/get')
def dnsGet():
    command = "ip dns print"  # Default command
    response = runCommand(command)
    parsedResponse = parseOutput(response, "dnsget")
    return jsonify(parsedResponse)

@app.route('/api/mikrotik/security/get')
def securityGet():
    command = 'interface wireless security-profiles print where name="default"'
    response = '''Flags: * - default 
        0   name="default"
            mode=dynamic-keys
            authentication-types=wpa2-psk
            unicast-ciphers=aes-ccm
            group-ciphers=aes-ccm
            wpa-pre-shared-key="mypassword123"
            wpa2-pre-shared-key="mypassword123"
            supplicant-identity="MikroTik"'''
    parsedResponse = parseOutput(response, "securityget")
    return jsonify(parsedResponse)

@app.route('/api/mikrotik/wlan/get')
def wlanGet():
    command = 'interface wireless print where name="wlan1"'
    response = """Flags: X - disabled, R - running 
        #    NAME       MTU   MAC-ADDRESS       MODE       SSID          CHANNEL   
        0  R wlan1      1500  64:D1:54:A1:B2:C3 ap-bridge  MyWiFi        2412/20MHz 
        """
    parsedResponse = parseOutput(response, "wlanget")
    return jsonify(parsedResponse)

@app.route('/api/mikrotik/device/get')
def deviceGet():
    command = "ip dhcp-server lease print detail"
    response = """Flags: X - disabled, R - dynamic, D - static
                #   ADDRESS         MAC-ADDRESS       HOST-NAME       STATUS
                0 D 192.168.1.100  AA:BB:CC:11:22:33  iPhone-11       bound
                1 D 192.168.1.101  DD:EE:FF:44:55:66  Samsung-Galaxy  bound
                2 D 192.168.1.102  11:22:33:44:55:66  LAPTOP-PC       bound
                """
    parsedResponse = parseOutput(response, "wlanget")
    return jsonify(parsedResponse)

@app.route('/api/mikrotik/expire/get')
def expireGet():
    host="192.168.0.10"
    command =f"ip dhcp-server lease print where address={host}"
    response="""Flags: X - disabled, R - dynamic, D - static
                #   ADDRESS         MAC-ADDRESS       HOST-NAME   STATUS  EXPIRES-AFTER  
                0 D 192.168.1.10  AA:BB:CC:11:22:33  iPhone-11   bound   23m45s
                """
    parsedResponse = parseOutput(response, "wlanget")
    return jsonify(parsedResponse)



# post route
@app.route('/api/mikrotik/dns/edit', methods=['POST'])
def dnsEdit():
    command = "/ip dns set servers="
    data = request.get_json()
    newDNS = data[0]["newDNS"]
    response = runCommand(command+newDNS)
    return response

@app.route('/api/mikrotik/security/edit', methods=['POST'])
def securityEdit():
    command = "/interface wireless security-profiles set [find name=default] wpa2-pre-shared-key="
    data = request.get_json()
    newPassword = data[0]["newPassword"]
    response = runCommand(command+newPassword)
    return response

@app.route('/api/mikrotik/wlan/ssid/edit', methods=['POST'])
def wlanSSIDEdit():
    command = "/interface wireless set wlan1 frequency="
    data = request.get_json()
    newFrequency = data[0]["newFrequency"]
    response = runCommand(command+newFrequency)
    return response

@app.route('/api/mikrotik/wlan/device/block', methods=['POST'])
def deviceBlock():
    data = request.get_json()
    macAddress = data[0]["macAddress"]
    command = f"/ip dhcp-server lease set [find mac-address={macAddress}] blocked=yes"
    response = runCommand(command+macAddress)
    return response


if __name__ == '__main__':
    app.run(debug=True)
