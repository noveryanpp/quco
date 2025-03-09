from flask import Flask, request, jsonify
from flask_cors import CORS
import MySQLdb
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)

# Konfigurasi Database MySQL
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "admin"
app.config["MYSQL_PASSWORD"] = "ali123"
app.config["MYSQL_DB"] = "client"
app.config["JWT_SECRET_KEY"] = "supersecretkey"

# Koneksi ke MySQL
db = MySQLdb.connect(
    host=app.config["MYSQL_HOST"],
    user=app.config["MYSQL_USER"],
    passwd=app.config["MYSQL_PASSWORD"],
    db=app.config["MYSQL_DB"]
)
cursor = db.cursor()

jwt = JWTManager(app)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    query = "SELECT * FROM admin WHERE username = %s AND password = %s"
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
    app.run(debug=True, port=5001)