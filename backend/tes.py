from flask import Flask, request, jsonify
import routeros_api

app = Flask(__name__)

# Konfigurasi MikroTik
MIKROTIK_HOST = "192.168.126.120"
MIKROTIK_USER = "admin"
MIKROTIK_PASSWORD = ""

def add_ip_to_mikrotik(ip_address, interface):
    try:
        connection = routeros_api.RouterOsApiPool(
            MIKROTIK_HOST, 
            username=MIKROTIK_USER, 
            password=MIKROTIK_PASSWORD,
            port=8728
        )
        api = connection.get_api()
        api.get_resource('/ip/address').add(address=ip_address, interface=interface)
        connection.disconnect()
        
        return {"status": "success", "message": f"IP {ip_address} ditambahkan ke {interface}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.route('/add-ip', methods=['POST'])
def add_ip():
    data = request.json
    ip_address = data.get("ip")
    interface = data.get("interface")

    if not ip_address or not interface:
        return jsonify({"status": "error", "message": "IP dan Interface harus diisi"}), 400

    result = add_ip_to_mikrotik(ip_address, interface)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5002)
