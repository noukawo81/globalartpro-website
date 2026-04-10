import { NextRequest, NextResponse } from 'next/server';

/**
 * API pour envoyer des emails
 * En production, utiliser SendGrid, AWS SES, ou similaire
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

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

    // En développement, logger seulement
    console.log('📧 ========================');
    console.log(`📧 Email envoyé à: ${to}`);
    console.log(`📧 Sujet: ${subject}`);
    console.log(`📧 Contenu: ${text || '[HTML seulement]'}`);
    console.log('📧 ========================');

    // En production, vous devriez utiliser un service comme:
    // - SendGrid (https://sendgrid.com)
    // - Resend (https://resend.com)
    // - AWS SES (https://aws.amazon.com/ses/)
    // - Mailgun (https://www.mailgun.com)

    // Pour cet exemple, on simule un envoi réussi
    // TODO: Implémenter avec un vrai service d'email

    // Stocker dans localStorage côté serveur si développement
    if (process.env.NODE_ENV === 'development') {
      // On pourrait aussi sauvegarder dans une base de données pour debug
      console.log('✅ Email enregistré en mode développement');
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Email envoyé avec succès',
        devMode: true,
        devNote: 'En développement, vérifiez les logs serveur pour les détails'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
