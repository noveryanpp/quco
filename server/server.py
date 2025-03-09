import paramiko
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
@app.route('/wireless')
def index():
    return "Hello, World!"


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