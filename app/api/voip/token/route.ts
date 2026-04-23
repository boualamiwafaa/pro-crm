import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Empêche Next.js de mettre le jeton en cache pour garantir un token frais à chaque appel
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // --- RÉCUPÉRATION SÉCURISÉE DEPUIS LE FICHIER .ENV ---
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY;
    const apiKeySecret = process.env.TWILIO_API_SECRET;
    const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID;

    // Vérification que toutes les clés sont présentes
    if (!accountSid || !apiKeySid || !apiKeySecret || !outgoingApplicationSid) {
      throw new Error("Variables d'environnement Twilio manquantes.");
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // GÉNÉRATION DU TOKEN SÉCURISÉ
    const token = new AccessToken(
      accountSid.trim(),
      apiKeySid.trim(),
      apiKeySecret.trim(),
      { 
        identity: 'agent_casablanca', 
        ttl: 3600 
      }
    );

    // ATTRIBUTION DES PERMISSIONS VOIX
    const grant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid.trim(),
      incomingAllow: true,
    });

    token.addGrant(grant);

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