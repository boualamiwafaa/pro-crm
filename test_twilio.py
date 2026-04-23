import os
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant

# REMPLACE AVEC TES VRAIES VALEURS ICI POUR LE TEST
ACCOUNT_SID = 'AC...' 
API_KEY = 'SK...'
API_SECRET = '...'
APP_SID = 'AP...'

try:
    token = AccessToken(ACCOUNT_SID, API_KEY, API_SECRET, identity='test_agent')
    grant = VoiceGrant(outgoing_application_sid=APP_SID)
    token.add_grant(grant)
    
    print("✅ SUCCÈS : Le token a été généré sans erreur !")
    print("Token généré :", token.to_jwt()[:50], "...")
except Exception as e:
    print("❌ ERREUR :", str(e))