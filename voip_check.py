import socket
import ssl
import time

def check_connection(host, port):
    print(f"--- Vérification de {host}:{port} ---")
    try:
        # 1. Test DNS
        ip = socket.gethostbyname(host)
        print(f"✅ DNS Résolu : {host} -> {ip}")
        
        # 2. Test de connexion TCP
        start = time.time()
        sock = socket.create_connection((host, port), timeout=5)
        latency = (time.time() - start) * 1000
        print(f"✅ Connexion TCP établie en {latency:.2f}ms")
        
        # 3. Test SSL/TLS (Indispensable pour Twilio)
        context = ssl.create_default_context()
        with context.wrap_socket(sock, server_hostname=host) as ssock:
            print(f"✅ Protocole TLS : {ssock.version()}")
        
        sock.close()
        return True
    except Exception as e:
        print(f"❌ ÉCHEC : {e}")
        return False

# Cibles critiques pour le SDK Twilio Voice
targets = [
    ("eventgw.twilio.com", 443),
    ("chunderw-vpc-gll.twilio.com", 443),
    ("matrix.twilio.com", 443)
]

print("DÉBUT DU DIAGNOSTIC RÉSEAU TWILIO\n")
results = [check_connection(h, p) for h, p in targets]

if all(results):
    print("\n🚀 Résultat : Votre réseau est OK. Le problème vient de Chrome ou du VPN.")
else:
    print("\n⚠️ Résultat : Un blocage réseau est détecté. Vérifiez votre pare-feu ou le fichier hosts.")