import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_SECRET;
    const outgoingApplicationSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKeySid || !apiKeySecret || !outgoingApplicationSid) {
      throw new Error("Variables d'environnement manquantes sur Vercel");
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(
      accountSid.trim(),
      apiKeySid.trim(),
      apiKeySecret.trim(),
      { identity: 'agent_casablanca', ttl: 3600 }
    );

    const grant = new VoiceGrant({
      outgoingApplicationSid: outgoingApplicationSid.trim(),
      incomingAllow: true,
    });

    token.addGrant(grant);

    return NextResponse.json({ token: token.toJwt() });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur Jeton", message: err.message }, 
      { status: 500 }
    );
  }
}