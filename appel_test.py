from twilio.rest import Client

account_sid = 'AC4074345742b422fe0f225e0a344f6d6b'
auth_token = 'f3aadd108d41fa625d840431e8172336'

client = Client(account_sid, auth_token)

try:
    print("🚀 Nouveau test en cours...")
    call = client.calls.create(
        # On ajoute une pause de 5 secondes au début pour te laisser décrocher
        twiml='<Response><Pause length="5"/><Say language="fr-FR">Bonjour, ceci est un test important pour Casablanca Elite Services. Si vous entendez ce message, votre intégration Python est un succès total !</Say></Response>',
        to='+212674396634',  
        from_='+212674396634' 
    )
    print(f"✅ APPEL RE-LANCÉ ! ID : {call.sid}")
except Exception as e:
    print(f"❌ Erreur : {e}")