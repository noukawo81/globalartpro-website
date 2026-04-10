import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * API pour envoyer des emails via Resend
 * En production, utilise Resend pour l'envoi réel d'emails
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: EmailPayload = await request.json();
    const { to, subject, html, text } = body;

    // Validation basique
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Email, sujet et contenu HTML requis' },
        { status: 400 }
      );
    }

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: "GlobalArtPro <verification@mail.globalartpro.com>",
      to: to,
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email', details: error.message },
        { status: 500 }
      );
    }

    console.log('📧 Email envoyé avec succès:', data);

    return NextResponse.json(
      {
        success: true,
        message: 'Email envoyé avec succès',
        data: data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
