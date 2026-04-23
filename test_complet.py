import requests
from twilio.rest import Client

# Identifiants
ACCOUNT_SID = 'AC4074345742b422fe0f225e0a344f6d6b' 
AUTH_TOKEN = 'f3aadd108d41fa625d840431e8172336' # Utilise ton AUTH_TOKEN principal ici

try:
    print("--- 1. Test de connexion API Twilio ---")
    client = Client(ACCOUNT_SID, AUTH_TOKEN)
    account = client.api.accounts(ACCOUNT_SID).fetch()
    print(f"✅ Connexion réussie ! Compte : {account.friendly_name}")

    print("\n--- 2. Vérification de l'application Voice (TwiML) ---")
    apps = client.applications.list(limit=5)
    if apps:
        for app in apps:
            print(f"📍 App trouvée : {app.friendly_name} (SID: {app.sid})")
    else:
        print("⚠️ Aucune TwiML App trouvée. Vérifie ta console Twilio.")

    print("\n--- 3. Test de latence réseau ---")
    r = requests.get('https://eventgw.twilio.com', timeout=5)
    print(f"✅ Latence Twilio Gateway : {r.elapsed.total_seconds()*1000:.0f}ms")

except Exception as e:
    print(f"❌ Erreur : {e}")