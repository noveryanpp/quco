from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_routes
from routes.user_routes import user_routes
from routes.package_routes import package_routes
from routes.mikrotik_routes import mikrotik_routes

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(user_routes)
app.register_blueprint(package_routes)
app.register_blueprint(mikrotik_routes)

if __name__ == "__main__":
    app.run(debug=True)
