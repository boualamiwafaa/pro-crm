import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Force le rendu dynamique pour éviter les jetons expirés en cache
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // RÉCUPÉRATION SÉCURISÉE DES VARIABLES DEPUIS VERCEL
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_SECRET;
    const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID;

    // VÉRIFICATION DE SÉCURITÉ
    if (!accountSid || !apiKeySid || !apiKeySecret || !outgoingApplicationSid) {
      console.error("Erreur : Variables Twilio manquantes dans l'environnement.");
      throw new Error("Variables de configuration manquantes.");
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // CRÉATION DU JETON D'ACCÈS
    const token = new AccessToken(
      accountSid.trim(),
      apiKeySid.trim(),
      apiKeySecret.trim(),
      { 
        identity: 'agent_casablanca', 
        ttl: 3600 
      }
    );

    // CONFIGURATION DES PERMISSIONS VOIX
    const grant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid.trim(),
      incomingAllow: true,
    });

    token.addGrant(grant);

    // RÉPONSE JSON AVEC LE TOKEN JWT
    return NextResponse.json({ 
      token: token.toJwt() 
    });

  } catch (err: any) {
    console.error("Erreur génération Token:", err.message);
    return NextResponse.json(
      { error: "Échec de génération du token", details: err.message }, 
      { status: 500 }
    );
  }
}