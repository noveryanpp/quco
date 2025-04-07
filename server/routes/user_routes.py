from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

user_routes = Blueprint("user_routes", __name__)

@user_routes.route("/add_user", methods=["POST"])
def add_user():
    try:
        data = request.json
        required_fields = ["name", "username", "password", "ip", "mac", "address", "phone"]
        
        if not all(data.get(field) for field in required_fields):
            return jsonify({"message": "Semua data wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = "INSERT INTO users (name, username, password, ip, mac, address, phone) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (data["name"], data["username"], data["password"], data["ip"], data["mac"], data["address"], data["phone"]))
            connection.commit()

        return jsonify({"message": "User berhasil ditambahkan!"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@user_routes.route('/get_users', methods=['GET'])
def get_users():
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
        return jsonify(users), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@user_routes.route('/get_user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM users where id=%s", user_id)
            users = cursor.fetchall()
        return jsonify(users), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Update User
@user_routes.route('/update_user/<int:user_id>', methods=['PUT'])
def update_users(user_id):
    try:
        data = request.json
        connection = get_db_connection()

        with connection.cursor() as cursor:
            sql = """
                UPDATE users 
                SET name=%s, username=%s, password=%s, ip=%s, mac=%s, address=%s, phone=%s 
                WHERE id=%s
            """
            values = (data['name'], data['username'], data['password'], data['ip'], data['mac'], data['address'], data['phone'], user_id)
            cursor.execute(sql, values)
            connection.commit()

        return jsonify({"message": "User berhasil diperbarui!"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Delete User
@user_routes.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        connection = get_db_connection()
        
        with connection.cursor() as cursor:
            sql = "DELETE FROM users WHERE id=%s"
            cursor.execute(sql, (user_id,))
            connection.commit()
        
        return jsonify({"message": "User berhasil dihapus!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
    
@user_routes.route('/add_admin', methods=['POST'])
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
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Edit Name
@user_routes.route('/update_name', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Edit username
@user_routes.route('/update_username', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Edit Password
@user_routes.route('/update_password', methods=['PUT'])
@jwt_required()
def update_password():
    try:
        data = request.json
        username = get_jwt_identity()  # Ambil username dari token JWT
        new_password = data.get('new_password')

        if not new_password:
            return jsonify({"message": "Password baru wajib diisi!"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Update password langsung tanpa perlu password lama
            update_query = "UPDATE users SET password = %s WHERE username = %s"
            cursor.execute(update_query, (new_password, username))
            connection.commit()

        return jsonify({"message": "Password berhasil diperbarui!"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Edit ip 
@user_routes.route('/update_ip', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Edit Mac
@user_routes.route('/update_mac', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Edit Address
@user_routes.route('/update_address', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Edit Phone
@user_routes.route('/update_phone', methods=['PUT'])
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

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    