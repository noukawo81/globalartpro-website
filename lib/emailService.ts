/**
 * Service d'envoi d'email pour GlobalArtPro
 * Supporte l'envoi de codes de vérification et de réinitialisation de mot de passe
 */

import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoyer un email via Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: "GlobalArtPro <verification@mail.globalartpro.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return { success: false, error: error.message };
    }

    console.log('Email envoyé avec succès:', data);
    return { success: true };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error: 'Erreur de connexion' };
  }
}

/**
 * Template pour email de vérification
 */
export function getVerificationEmailTemplate(code: string, email: string): EmailOptions {
  return {
    to: email,
    subject: 'Vérifiez votre email - GlobalArtPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">GlobalArtPro</h1>
        </div>
        
        <div style="padding: 40px; background: #f5f5f5; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; text-align: center;">Vérification d'email</h2>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Bonjour,<br><br>
            Merci de votre inscription à GlobalArtPro. Pour finaliser votre inscription, veuillez utiliser le code de vérification ci-dessous :
          </p>
          
          <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px; border: 2px solid #667eea;">
            <p style="font-size: 32px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 2px;">${code}</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Ce code expire dans 15 minutes</p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Si vous n'avez pas demandé cette vérification, veuillez ignorer cet email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 GlobalArtPro. Tous droits réservés.
          </p>
        </div>
      </div>
    `,
    text: `Votre code de vérification GlobalArtPro: ${code}. Ce code expire dans 15 minutes.`
  };
}

/**
 * Template pour email de réinitialisation de mot de passe
 */
export function getPasswordResetEmailTemplate(code: string, email: string): EmailOptions {
  return {
    to: email,
    subject: 'Réinitialisez votre mot de passe - GlobalArtPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">GlobalArtPro</h1>
        </div>
        
        <div style="padding: 40px; background: #f5f5f5; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333; text-align: center;">Réinitialisation du mot de passe</h2>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Bonjour,<br><br>
            Vous avez demandé la réinitialisation de votre mot de passe GlobalArtPro. Veuillez utiliser le code ci-dessous :
          </p>
          
          <div style="background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px; border: 2px solid #764ba2;">
            <p style="font-size: 32px; font-weight: bold; color: #764ba2; margin: 0; letter-spacing: 2px;">${code}</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Ce code expire dans 15 minutes</p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et ne pas partager ce code.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 GlobalArtPro. Tous droits réservés.
          </p>
        </div>
      </div>
    `,
    text: `Votre code de réinitialisation de mot de passe GlobalArtPro: ${code}. Ce code expire dans 15 minutes.`
  };
}
