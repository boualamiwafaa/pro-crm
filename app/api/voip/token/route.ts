import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Récupération et nettoyage strict des variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const apiKeySid = process.env.TWILIO_API_KEY_SID?.trim();
    const apiKeySecret = process.env.TWILIO_API_SECRET?.trim();
    const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID?.trim();

    // 2. Vérification de présence
    if (!accountSid || !apiKeySid || !apiKeySecret || !outgoingApplicationSid) {
      console.error("Erreur: Variables d'environnement manquantes");
      return NextResponse.json(
        { error: "Configuration incomplète", details: "Vérifiez le fichier .env" },
        { status: 500 }
      );
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // 3. Création du Token avec la syntaxe exacte recommandée
    // L'identité doit être unique par session si possible
    const identity = `agent_casablanca_${Math.floor(Math.random() * 1000)}`;

    const token = new AccessToken(
      accountSid,
      apiKeySid,
      apiKeySecret,
      { 
        identity: identity, 
        ttl: 3600 
      }
    );

    // 4. Configuration des droits (Grants)
    const grant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid,
      incomingAllow: true, // Permet de recevoir des appels aussi
    });

    token.addGrant(grant);

    // 5. Envoi du JWT
    return NextResponse.json({ 
      token: token.toJwt(),
      identity: identity 
    });

  } catch (err: any) {
    console.error("Erreur génération Token:", err.message);
    return NextResponse.json(
      { error: "Erreur Jeton", message: err.message }, 
      { status: 500 }
    );
  }
}