import socket

def check_twilio_reachability():
    hosts = [
        ("chunderw-vpc-gll.twilio.com", 443),
        ("eventgw.twilio.com", 443),
        ("matrix.twilio.com", 443)
    ]
    
    print("🔍 Diagnostic réseau pour Casablanca Elite Services...")
    for host, port in hosts:
        try:
            socket.create_connection((host, port), timeout=5)
            print(f"✅ {host} est JOIGNABLE")
        except Exception as e:
            print(f"❌ {host} est BLOQUÉ : {e}")

check_twilio_reachability()