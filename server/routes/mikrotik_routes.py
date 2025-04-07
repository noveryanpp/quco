from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from mikrotik import runCommand, parseOutput
from routes.user_routes import get_user

mikrotik_routes = Blueprint("mikrotik_routes", __name__)

def tambah_user(username, ip):
    command = f'/ip firewall filter add chain=forward src-address={ip} out-interface=ether1 action=drop comment="{username} Internet Access"'
    runCommand(command, 'admin')

@mikrotik_routes.route('/tambah_paket_user/<int:paket_id>', methods=['POST'])
def tambah_paket_user(paket_id):
    user_id = request.json
    user_data = get_user(user_id)
    
    
    command1 = f'''/ip firewall filter set [find comment="{user_data.username} Internet Access"] action=accept
                /queue simple add name=limit_{user_data.username} target={user_data.ip} max-limit={speed}/{speed}
                /system scheduler add name=block_{user_data.user} start-date=[/system clock get date] start-time=00:00 interval={limit}d on-event="/ip firewall filter disable [find comment=\"{user_data.username} Internet Access\"]"
                '''
    
    # command1 = '/ip firewall filter add chain=forward src-address=192.168.1.100 out-interface=ether1 action=drop'


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

@mikrotik_routes.route('/api/mikrotik/security/get')
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

@mikrotik_routes.route('/api/mikrotik/wlan/get')
def wlanGet():
    command = 'interface wireless print where name="wlan1"'
    response = """Flags: X - disabled, R - running 
        #    NAME       MTU   MAC-ADDRESS       MODE       SSID          CHANNEL   
        0  R wlan1      1500  64:D1:54:A1:B2:C3 ap-bridge  MyWiFi        2412/20MHz 
        """
    parsedResponse = parseOutput(response, "wlanget")
    return jsonify(parsedResponse)

@mikrotik_routes.route('/api/mikrotik/device/get')
def deviceGet():
    response = """Flags: X - disabled, R - dynamic, D - static
                #   ADDRESS         MAC-ADDRESS       HOST-NAME       STATUS
                0 D 192.168.1.100  AA:BB:CC:11:22:33  iPhone-11       bound
                1 D 192.168.1.101  DD:EE:FF:44:55:66  Samsung-Galaxy  bound
                2 D 192.168.1.102  40:F0:23:CG:D2:00  Redmi-Note-9    bound
                """

    devices = []
    for line in response.split("\n"):
        if "bound" in line:
            parts = line.split()
            devices.append({
                "ip_address": parts[2],
                "mac_address": parts[3],
                "device_name": parts[4].replace("-", " "),  # Ganti "-" dengan spasi untuk nama perangkat
            })

    return jsonify({"connected_devices": len(devices), "devices": devices})

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
@mikrotik_routes.route('/api/mikrotik/dns/edit', methods=['POST'])
def dnsEdit():
    command = "/ip dns set servers="
    data = request.get_json()
    newDNS = data[0]["newDNS"]
    response = runCommand(command+newDNS)
    return response

@mikrotik_routes.route('/api/mikrotik/security/edit', methods=['POST'])
def securityEdit():
    command = "/interface wireless security-profiles set [find name=default] wpa2-pre-shared-key="
    data = request.get_json()
    newPassword = data[0]["newPassword"]
    response = runCommand(command+newPassword)
    return response

@mikrotik_routes.route('/api/mikrotik/wlan/ssid/edit', methods=['POST'])
def wlanSSIDEdit():
    command = "/interface wireless set wlan1 frequency="
    data = request.get_json()
    newFrequency = data[0]["newFrequency"]
    response = runCommand(command+newFrequency)
    return response

@mikrotik_routes.route('/api/mikrotik/wlan/device/block', methods=['POST'])
def deviceBlock():
    data = request.get_json()
    macAddress = data[0]["macAddress"]
    command = f"/ip dhcp-server lease set [find mac-address={macAddress}] blocked=yes"
    response = runCommand(command+macAddress)
    return response