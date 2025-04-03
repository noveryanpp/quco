from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from db import get_db_connection

auth_routes = Blueprint("auth_routes", __name__)
@jwt_required
@auth_routes.route("/admin/login", methods=["POST"])
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

@auth_routes.route("/auth/login", methods=["POST"])
def login():
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()
    with connection.cursor() as cursor:
        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

    if not user:
        return jsonify({"msg": "Username atau password salah!"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@auth_routes.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
