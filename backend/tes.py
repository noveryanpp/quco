import paramiko

# Konfigurasi MikroTik
hostname = '192.168.126.120'  # IP MikroTik
port = 22                  # Port SSH default
username = 'admin'         # Username MikroTik
password = ''      # Password MikroTik

# Membuat SSH Client
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    # Koneksi ke MikroTik
    client.connect(hostname, port=port, username=username, password=password)
    print("Koneksi SSH ke MikroTik berhasil!")

    # Menjalankan perintah sederhana di MikroTik
    stdin, stdout, stderr = client.exec_command('/system resource print')
    print(stdout.read().decode())  # Menampilkan hasil

except paramiko.AuthenticationException:
    print("Autentikasi gagal. Periksa username/password.")
except paramiko.SSHException as sshException:
    print(f"Gagal koneksi SSH: {sshException}")
except Exception as e:
    print(f"Terjadi kesalahan: {e}")
finally:
    client.close()  # Tutup koneksi
