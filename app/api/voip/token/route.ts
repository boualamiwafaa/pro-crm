import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: 'agent_casablanca',
    });

    const grant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    token.addGrant(grant);

return NextResponse.json({ token: token.toJwt() }, {
  status: 200,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});
  } catch (error) {
    console.error('Erreur génération token:', error);
    return NextResponse.json({ error: 'Erreur serveur token' }, { status: 500 });
  }
}