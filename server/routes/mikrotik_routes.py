from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from mikrotik import runCommand, parseOutput
from routes.user_routes import get_user, get_user_by_username
from routes.package_routes import get_paket_by_id

mikrotik_routes = Blueprint("mikrotik_routes", __name__)

def tambah_user(username, ip):
    command = f'/ip firewall filter add chain=forward src-address={ip} out-interface=ether1 action=drop comment="{username} Internet Access"'
    runCommand(command, 'admin')

@mikrotik_routes.route('/tambah_paket_user/<int:paket_id>')
def tambah_paket_user(username, paket_id):
    paket = get_paket_by_id(paket_id)
    paket_data = paket.get_json()[0]
    user = get_user_by_username(username)

    speed = paket_data["kecepatan"]
    limit = paket_data["masa_aktif"]
    ip = user.get_json()[0]['ip']
    
    command = f'''/ip firewall filter set [find comment="{username} Internet Access"] action=accept
                /queue simple add name=limit_{username} target={ip} max-limit={speed}/{speed}
                /system scheduler add name=block_{username} start-date=[/system clock get date] start-time=00:00 interval={limit}d on-event="/ip firewall filter set [find comment="{username} Internet Access"] action=drop"
                '''

    runCommand(command, 'admin')

@mikrotik_routes.route('/api/mikrotik/ip/get')
@jwt_required()
def ipGet():
    user = get_jwt_identity()
    
    command = "ip address print"
    response = runCommand(command, user)
    parsedResponse = parseOutput(response, "ipget")
    return jsonify(parsedResponse) 

@mikrotik_routes.route('/tesjwt')
@jwt_required()
def tes():
    user = get_jwt_identity()
    return user

@mikrotik_routes.route('/api/mikrotik/dns/get')
def dnsGet():
    user = get_jwt_identity()
    command = "ip dns print"  # Default command
    response = runCommand(command,user)
    parsedResponse = parseOutput(response, "dnsget")
    return jsonify(parsedResponse)

# @mikrotik_routes.route('/api/mikrotik/security/get')
# def securityGet():
#     command = 'interface wireless security-profiles print where name="default"'
#     response = '''Flags: * - default 
#         0   name="default"
#             mode=dynamic-keys
#             authentication-types=wpa2-psk
#             unicast-ciphers=aes-ccm
#             group-ciphers=aes-ccm
#             wpa-pre-shared-key="mypassword123"
#             wpa2-pre-shared-key="mypassword123"
#             supplicant-identity="MikroTik"'''
#     parsedResponse = parseOutput(response, "securityget")
#     return jsonify(parsedResponse)

@mikrotik_routes.route('/api/mikrotik/security/get')
@jwt_required()
def securityGet():
    try:
        user = get_jwt_identity()
        command = 'interface wireless security-profiles print where name="default"'
        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        parsedResponse = parseOutput(output, "securityget")
        return jsonify(parsedResponse)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# @mikrotik_routes.route('/api/mikrotik/wlan/get')
# def wlanGet():
#     command = 'interface wireless print where name="wlan1"'
#     response = """Flags: X - disabled, R - running 
#         #    NAME       MTU   MAC-ADDRESS       MODE       SSID          CHANNEL   
#         0  R wlan1      1500  64:D1:54:A1:B2:C3 ap-bridge  Mujiasih        2412/20MHz 
#         """
#     parsedResponse = parseOutput(response, "wlanget")
#     return jsonify(parsedResponse)

@mikrotik_routes.route('/api/mikrotik/wlan/get')
@jwt_required()
def wlanGet():
    try:
        user = get_jwt_identity()
        command = 'interface wireless print where name="wlan1"'
        
        output = runCommand(command, user)
        
        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500
        
        parsedResponse = parseOutput(output, "wlanget")
        return jsonify(parsedResponse)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# # @mikrotik_routes.route('/api/mikrotik/device/get')
# # def deviceGet():
#     response = """Flags: X - disabled, R - dynamic, D - static
#                 #   ADDRESS         MAC-ADDRESS       HOST-NAME       STATUS
#                 0 D 192.168.1.100  AA:BB:CC:11:22:33  iPhone-11       bound
#                 1 D 192.168.1.101  DD:EE:FF:44:55:66  Samsung-Galaxy  bound
#                 2 D 192.168.1.102  40:F0:23:CG:D2:00  Redmi-Note-9    bound
#                 2 D 192.168.1.102  40:F0:23:CG:D2:00  Usehhhhhhhhh    bound
#                 """

#     devices = []
#     for line in response.split("\n"):
#         if "bound" in line:
#             parts = line.split()
#             devices.append({
#                 "ip_address": parts[2],
#                 "mac_address": parts[3],
#                 "device_name": parts[4].replace("-", " "),  # Ganti "-" dengan spasi untuk nama perangkat
#             })

#     return jsonify({"connected_devices": len(devices), "devices": devices})

@mikrotik_routes.route('/api/mikrotik/device/get')
@jwt_required()
def deviceGet():
    try:
        user = get_jwt_identity()
        command = "/ip dhcp-server lease print"

        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        devices = []
        for line in output.split("\n"):
            if "bound" in line:
                parts = line.split()
                if len(parts) >= 5:
                    devices.append({
                        "ip_address": parts[2],
                        "mac_address": parts[3],
                        "device_name": parts[4].replace("-", " "),
                    })

        return jsonify({
            "connected_devices": len(devices),
            "devices": devices
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@mikrotik_routes.route('/api/mikrotik/expire/get')
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
# @mikrotik_routes.route('/api/mikrotik/ssid/edit', methods=['POST'])
# def ssidEdit():
#     command = '/interface wireless set wlan1 ssid='
#     data = request.get_json()
#     newSSID = data[0]["newSSID"]
#     response = runCommand(command + '"' + newSSID + '"')
#     return response

@mikrotik_routes.route('/api/mikrotik/ssid/edit', methods=['POST'])
@jwt_required()
def ssidEdit():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        if not data or "newSSID" not in data[0]:
            return jsonify({"status": "error", "message": "Data SSID tidak valid"}), 400

        new_ssid = data[0]["newSSID"]
        command = f'/interface wireless set wlan1 ssid="{new_ssid}"'

        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        return jsonify({
            "status": "success",
            "command": command,
            "output": output
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# @mikrotik_routes.route('/api/mikrotik/dns/edit', methods=['POST'])
# def dnsEdit():
#     command = "/ip dns set servers="
#     data = request.get_json()
#     newDNS = data[0]["newDNS"]
#     response = runCommand(command+newDNS)
#     return response

@mikrotik_routes.route('/api/mikrotik/dns/edit', methods=['POST'])
@jwt_required()
def dnsEdit():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        if not data or "newDNS" not in data[0]:
            return jsonify({"status": "error", "message": "Data DNS tidak valid"}), 400

        new_dns = data[0]["newDNS"]
        command = f"/ip dns set servers={new_dns}"

        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        return jsonify({
            "status": "success",
            "command": command,
            "output": output
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# @mikrotik_routes.route('/api/mikrotik/security/edit', methods=['POST'])
# def securityEdit():
#     command = "/interface wireless security-profiles set [find name=default] wpa2-pre-shared-key="
#     data = request.get_json()
#     newPassword = data[0]["newPassword"]
#     response = runCommand(command+newPassword)
#     return response

@mikrotik_routes.route('/api/mikrotik/security/edit', methods=['POST'])
@jwt_required()
def securityEdit():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        if not data or "newPasswd" not in data[0]:
            return jsonify({"status": "error", "message": "Data password tidak valid"}), 400

        new_passwd = data[0]["newPasswd"]
        command = f"/interface wireless security-profiles set [find name=default] wpa2-pre-shared-key={new_passwd}"

        output = runCommand(command, user)
        
        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        return jsonify({
            "status": "success",
            "command": command,
            "output": output
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

# @mikrotik_routes.route('/api/mikrotik/chanel/edit', methods=['POST'])
# def chanelEdit():
#     command = "/interface wireless set wlan1 frequency="
#     data = request.get_json()
#     newFrequency = data[0]["newFrequency"]
#     response = runCommand(command + newFrequency)
#     return response

@mikrotik_routes.route('/api/mikrotik/chanel/edit', methods=['POST'])
@jwt_required()
def chanelEdit():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        if not data or "newFrequency" not in data[0]:
            return jsonify({"status": "error", "message": "Data frequency tidak valid"}), 400

        new_frequency = data[0]["newFrequency"]
        command = f"/interface wireless set wlan1 frequency={new_frequency}"

        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        return jsonify({
            "status": "success",
            "command": command,
            "output": output
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# @mikrotik_routes.route('/api/mikrotik/wlan/device/block', methods=['POST'])
# def deviceBlock():
#     data = request.get_json()
#     macAddress = data[0]["macAddress"]
#     command = f"/ip dhcp-server lease set [find mac-address={macAddress}] blocked=yes"
#     response = runCommand(command+macAddress)
#     return response

@mikrotik_routes.route('/api/mikrotik/wlan/device/block', methods=['POST'])
@jwt_required()
def deviceBlock():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        if not data or "mac_address" not in data[0]:
            return jsonify({"status": "error", "message": "MAC address tidak valid"}), 400

        mac_address = data[0]["mac_address"]
        command = f"/ip dhcp-server lease set [find mac-address={mac_address}] blocked=yes"

        output = runCommand(command, user)

        if isinstance(output, dict) and "error" in output:
            return jsonify({
                "status": "error",
                "command": command,
                "output": output
            }), 500

        return jsonify({
            "status": "success",
            "command": command,
            "output": output
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def parseOutput(response, tipe):
    result = {}

    if tipe == "wlanget":
        lines = response.strip().splitlines()
        headers_line = None
        data_line = None

        for i, line in enumerate(lines):
            if "NAME" in line and "SSID" in line:
                headers_line = line
                data_line = lines[i + 1] if i + 1 < len(lines) else None
                break

        if not headers_line or not data_line:
            return {"SSID": "Tidak ditemukan"}

        # Ambil posisi kolom
        headers = []
        last_index = 0
        for part in headers_line.split():
            index = headers_line.find(part, last_index)
            headers.append((part, index))
            last_index = index + len(part)

        # Ambil nilai berdasarkan posisi kolom
        parsed = {}
        for i, (header, start) in enumerate(headers):
            end = headers[i + 1][1] if i + 1 < len(headers) else None
            value = data_line[start:end].strip()
            parsed[header] = value

        return {"SSID": parsed.get("SSID", "Tidak ditemukan")}

    elif tipe == "deviceget":
        # Parsing khusus untuk device list
        lines = response.strip().splitlines()
        headers_line = None
        for i, line in enumerate(lines):
            if "ADDRESS" in line and "MAC-ADDRESS" in line:
                headers_line = line
                data_lines = lines[i + 1:]
                break

        if not headers_line:
            return []

        # Ambil posisi kolom
        headers = []
        last_index = 0
        for part in headers_line.split():
            index = headers_line.find(part, last_index)
            headers.append((part, index))
            last_index = index + len(part)

        # Parse setiap baris data
        devices = []
        for line in data_lines:
            device = {}
            for i, (header, start) in enumerate(headers):
                end = headers[i + 1][1] if i + 1 < len(headers) else None
                value = line[start:end].strip()
                device[header] = value
            devices.append({
                "ip_address": device.get("ADDRESS"),
                "mac_address": device.get("MAC-ADDRESS"),
                "device_name": device.get("HOST-NAME"),
            })

        return devices

    else:
        # Parsing standar key=value
        lines = response.splitlines()
        for line in lines:
            line = line.strip()
            if "=" in line:
                key, value = line.split("=", 1)
                key = key.strip().replace('"', '')
                value = value.strip().strip('"')
                result[key] = value
        return result
    