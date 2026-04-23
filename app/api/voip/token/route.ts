import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Empêche Next.js de mettre le jeton en cache
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // --- NOUVEAUX IDENTIFIANTS TWILIO ---
    const accountSid = "AC4074345742b422fe0f225e0a344f6d6b";
    const apiKeySid = "SKe7b27cdbcab856e69f9b00bd9af790e4";
    const apiKeySecret = "W4Jm5GCnJFKQWgGlRJGtnE0GQwMdXrXn";
    
    // Ton TwiML App SID pour Casablanca Elite Services
    const outgoingApplicationSid = "AP0cd0610037df51ce2708b32a6eb9b0d3";

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // GÉNÉRATION DU TOKEN
    // L'ordre des arguments est CRITIQUE : (AccountSid, ApiKeySid, ApiKeySecret)
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
      incomingAllow: true, // Permet de recevoir des appels si nécessaire
    });

    token.addGrant(grant);

    // Retourne le JWT au format JSON
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