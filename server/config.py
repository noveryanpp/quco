import os
from dotenv import load_dotenv
from pathlib import Path
from midtransclient import Snap

# Use sandbox credentials first!

dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

snap = Snap(
    is_production=False,
    server_key=os.getenv("MIDTRANS_SERVER_KEY"),
    client_key=os.getenv("MIDTRANS_CLIENT_KEY")
)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    
    # Database Configuration
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB = os.getenv("MYSQL_DB")

    # MikroTik Configuration
    MIKROTIK_HOST = os.getenv("MIKROTIK_HOST")
    MIKROTIK_USER = os.getenv("MIKROTIK_USER")
    MIKROTIK_PASS = os.getenv("MIKROTIK_PASS")

