import paramiko
from flask import jsonify
from config import Config
from db import get_db_connection

def runCommand(command, user):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        query = "SELECT ip FROM users WHERE username = %s"
        cursor.execute(query, (user,))
        ip = cursor.fetchone()[0]
    
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(ip, username=Config.MIKROTIK_USER, password=Config.MIKROTIK_PASS)
        stdin, stdout, stderr = client.exec_command(command)
        output = stdout.read().decode()
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
