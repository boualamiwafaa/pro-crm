import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  const formData = await request.formData();
  const To = formData.get('To') as string;

  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Ce numéro doit être celui qui est dans ta liste "Verified Caller IDs"
  const dial = response.dial({
    callerId: '+212674396634', // Ton numéro vérifié
    answerOnBridge: true,
  });

  if (To) {
    dial.number(To);
  }

  return new NextResponse(response.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}