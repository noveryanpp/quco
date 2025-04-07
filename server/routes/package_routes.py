from flask import Blueprint, request, jsonify
from db import get_db_connection
from mikrotik import runCommand, parseOutput

package_routes = Blueprint("package_routes", __name__)

@package_routes.route("/add_paket", methods=["POST"])
def add_paket():
    try:
        data = request.json
        required_fields = ["name", "kecepatan", "harga", "masa_aktif"]
        
        if not all(data.get(field) for field in required_fields):
            return jsonify({"message": "Wajib diisi"}), 400

        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = "INSERT INTO paket (name, kecepatan, harga, masa_aktif) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (data["name"], data["kecepatan"], data["harga"], data["masa_aktif"]))
            connection.commit()

        return jsonify({"message": "Paket berhasil ditambahkan!"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@package_routes.route('/get_paket', methods=['GET'])
def get_paket():
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM paket")
            paket = cursor.fetchall()
        return jsonify(paket), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

@package_routes.route('/get_paket/<int:paket_id>', methods=['GET'])
def get_paket_by_id(paket_id):
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM paket WHERE id=%s", (paket_id,))
            paket = cursor.fetchall()
        return jsonify(paket), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Update Paket
@package_routes.route('/update_paket/<int:paket_id>', methods=['PUT'])
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

        return jsonify({"message": "Paket berhasil diperbarui!"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Delete Paket
@package_routes.route('/delete_paket/<int:paket_id>', methods=['DELETE'])
def delete_paket(paket_id):
    try:
        connection = get_db_connection()
        
        with connection.cursor() as cursor:
            sql = "DELETE FROM paket WHERE id=%s"
            cursor.execute(sql, (paket_id,))
            connection.commit()
                    
        return jsonify({"message": "Paket berhasil dihapus!"}), 200
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    


def add_paket_to_user(user_id, paket_id):
    try:
        connection = get_db_connection()
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
            user = cursor.fetchall()
            cursor.execute("SELECT * FROM paket WHERE id=%s", (paket_id,))
            paket = cursor.fetchall()
            cursor.execute("INSERT INTO paket_user(user_id,paket_id, start_at, expired_at) values(%s,%s,now(),DATE_ADD(NOW(), INTERVAL %s DAY))", (user_id,paket_id,paket[0]['masa_aktif']))
            connection.commit()

        command1 = '''/ip firewall filter add chain=forward src-address={user['ip']} action=accept comment="{user_data.username} Internet Access"
            /queue simple add name=limit_{user_data.username} target={user_data.ip} max-limit={speed}/{speed};
            /system scheduler add name=block_{user_data.user} start-date=[/system clock get date] start-time=00:00 interval={limit}d on-event="/ip firewall filter disable [find comment=\"{user_data.username} Internet Access\"]"
            '''
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@package_routes.route('/buy_paket/', methods=["POST"])
def buy_paket():
    try:
        # connection = get_db_connection()
        # with connection.cursor(dictionary=True) as cursor:
        #     cursor.execute("SELECT * FROM paket WHERE id=%s", (paket_id))
        #     paket = cursor.fetchall()
        a=add_paket_to_user(8,1)
        return a
    except Exception as e:
        return jsonify({"message": str(e)}), 500