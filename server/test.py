import mysql.connector
from dotenv import load_dotenv
import os
import paramiko
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from pathlib import Path
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

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

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
