import { NextRequest, NextResponse } from 'next/server';

// Types de sécurité
interface SecurityEvent {
  id: string;
  type: 'fraud_attempt' | 'multiple_accounts' | 'suspicious_activity' | 'email_verification';
  userId?: string;
  email?: string;
  ip: string;
  userAgent: string;
  deviceFingerprint: string;
  timestamp: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface FraudDetection {
  ip: string;
  email: string;
  deviceFingerprint: string;
  registrationAttempts: number;
  lastAttempt: string;
  blockedUntil?: string;
  riskScore: number;
}

// Base de données simulée pour la sécurité
const securityEvents: SecurityEvent[] = [];
const fraudDatabase: Record<string, FraudDetection> = {};
const emailVerificationCodes: Record<string, { code: string; expires: number; attempts: number }> = {};

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_REGISTRATION_ATTEMPTS_PER_IP: 5,
  MAX_REGISTRATION_ATTEMPTS_PER_EMAIL: 3,
  MAX_REGISTRATION_ATTEMPTS_PER_DEVICE: 3,
  BLOCK_DURATION_MINUTES: 60,
  EMAIL_VERIFICATION_CODE_LENGTH: 6,
  EMAIL_VERIFICATION_CODE_EXPIRY: 15 * 60 * 1000, // 15 minutes
  MAX_EMAIL_VERIFICATION_ATTEMPTS: 3,
  FRAUD_RISK_THRESHOLDS: {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 90
  }
};

// Générer un fingerprint de device
function generateDeviceFingerprint(req: NextRequest): string {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  const platform = req.headers.get('sec-ch-ua-platform') || '';

  // Créer un hash simple du fingerprint
  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}|${platform}`;
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en 32 bits
  }
  return Math.abs(hash).toString(36);
}

// Obtenir l'IP du client
function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

// Calculer le score de risque de fraude
function calculateFraudRisk(ip: string, email: string, deviceFingerprint: string): number {
  let riskScore = 0;

  // Vérifier l'IP
  const ipRecords = Object.values(fraudDatabase).filter(record => record.ip === ip);
  if (ipRecords.length > 3) riskScore += 30;
  if (ipRecords.some(r => r.registrationAttempts > SECURITY_CONFIG.MAX_REGISTRATION_ATTEMPTS_PER_IP)) riskScore += 40;

  // Vérifier l'email
  const emailRecords = Object.values(fraudDatabase).filter(record => record.email === email);
  if (emailRecords.length > 1) riskScore += 50;
  if (emailRecords.some(r => r.registrationAttempts > SECURITY_CONFIG.MAX_REGISTRATION_ATTEMPTS_PER_EMAIL)) riskScore += 30;

  // Vérifier le device
  const deviceRecords = Object.values(fraudDatabase).filter(record => record.deviceFingerprint === deviceFingerprint);
  if (deviceRecords.length > 2) riskScore += 20;

  return Math.min(riskScore, 100);
}

// Vérifier si l'IP/email/device est bloqué
function isBlocked(ip: string, email: string, deviceFingerprint: string): boolean {
  const now = Date.now();
  const records = Object.values(fraudDatabase).filter(record =>
    record.ip === ip || record.email === email || record.deviceFingerprint === deviceFingerprint
  );

  return records.some(record => {
    if (record.blockedUntil && new Date(record.blockedUntil).getTime() > now) {
      return true;
    }
    return false;
  });
}

// Logger un événement de sécurité
function logSecurityEvent(
  type: SecurityEvent['type'],
  severity: SecurityEvent['severity'],
  req: NextRequest,
  details: Record<string, any> = {},
  userId?: string,
  email?: string
): void {
  const ip = getClientIP(req);
  const deviceFingerprint = generateDeviceFingerprint(req);

  const event: SecurityEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    userId,
    email,
    ip,
    userAgent: req.headers.get('user-agent') || '',
    deviceFingerprint,
    timestamp: new Date().toISOString(),
    details,
    severity
  };

  securityEvents.push(event);

  // Garder seulement les 1000 derniers événements
  if (securityEvents.length > 1000) {
    securityEvents.shift();
  }

  console.log(`🔒 Security Event: ${type} (${severity}) - IP: ${ip}, Email: ${email || 'N/A'}`);
}

// Générer un code de vérification email
function generateEmailVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// API pour vérifier la sécurité avant inscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, username } = body;

    const ip = getClientIP(request);
    const deviceFingerprint = generateDeviceFingerprint(request);

    switch (action) {
      case 'check_security':
        // Vérifier si l'email/IP/device est suspect
        const isBlockedUser = isBlocked(ip, email, deviceFingerprint);
        const riskScore = calculateFraudRisk(ip, email, deviceFingerprint);

        if (isBlockedUser) {
          logSecurityEvent('fraud_attempt', 'high', request, { reason: 'blocked_user' }, undefined, email);
          return NextResponse.json({
            error: 'Accès temporairement bloqué. Veuillez réessayer plus tard.',
            blocked: true
          }, { status: 429 });
        }

        if (riskScore >= SECURITY_CONFIG.FRAUD_RISK_THRESHOLDS.CRITICAL) {
          logSecurityEvent('fraud_attempt', 'critical', request, { riskScore }, undefined, email);
          return NextResponse.json({
            error: 'Activité suspecte détectée. Vérification supplémentaire requise.',
            requiresVerification: true
          }, { status: 400 });
        }

        return NextResponse.json({
          safe: true,
          riskScore,
          requiresVerification: riskScore >= SECURITY_CONFIG.FRAUD_RISK_THRESHOLDS.MEDIUM
        });

      case 'send_verification_email':
        // Vérifier les limites
        const existingCode = emailVerificationCodes[email];
        if (existingCode) {
          if (existingCode.attempts >= SECURITY_CONFIG.MAX_EMAIL_VERIFICATION_ATTEMPTS) {
            logSecurityEvent('fraud_attempt', 'medium', request, { reason: 'too_many_verification_attempts' }, undefined, email);
            return NextResponse.json({
              error: 'Trop de tentatives. Réessayez dans 1 heure.'
            }, { status: 429 });
          }

          if (Date.now() - existingCode.expires < 60000) { // 1 minute minimum entre envois
            return NextResponse.json({
              error: 'Veuillez attendre avant de redemander un code.'
            }, { status: 429 });
          }
        }

        // Générer et stocker le code
        const code = generateEmailVerificationCode();
        emailVerificationCodes[email] = {
          code,
          expires: Date.now() + SECURITY_CONFIG.EMAIL_VERIFICATION_CODE_EXPIRY,
          attempts: (existingCode?.attempts || 0) + 1
        };

        // Simuler l'envoi d'email (en production, utiliser un service comme SendGrid)
        console.log(`📧 Code de vérification pour ${email}: ${code}`);

        logSecurityEvent('email_verification', 'low', request, { sent: true }, undefined, email);

        return NextResponse.json({
          success: true,
          message: 'Code de vérification envoyé à votre email.',
          expiresIn: SECURITY_CONFIG.EMAIL_VERIFICATION_CODE_EXPIRY / 1000
        });

      case 'verify_email':
        const { verificationCode } = body;
        const storedCode = emailVerificationCodes[email];

        if (!storedCode) {
          logSecurityEvent('fraud_attempt', 'medium', request, { reason: 'no_verification_code' }, undefined, email);
          return NextResponse.json({
            error: 'Aucun code de vérification trouvé. Veuillez en demander un nouveau.'
          }, { status: 400 });
        }

        if (Date.now() > storedCode.expires) {
          delete emailVerificationCodes[email];
          logSecurityEvent('fraud_attempt', 'low', request, { reason: 'expired_code' }, undefined, email);
          return NextResponse.json({
            error: 'Code expiré. Veuillez en demander un nouveau.'
          }, { status: 400 });
        }

        if (storedCode.code !== verificationCode) {
          storedCode.attempts++;
          if (storedCode.attempts >= SECURITY_CONFIG.MAX_EMAIL_VERIFICATION_ATTEMPTS) {
            delete emailVerificationCodes[email];
            logSecurityEvent('fraud_attempt', 'high', request, { reason: 'too_many_wrong_codes' }, undefined, email);
            return NextResponse.json({
              error: 'Trop d\'erreurs. Email temporairement bloqué.'
            }, { status: 429 });
          }

          logSecurityEvent('fraud_attempt', 'low', request, { reason: 'wrong_code' }, undefined, email);
          return NextResponse.json({
            error: 'Code incorrect.',
            attemptsLeft: SECURITY_CONFIG.MAX_EMAIL_VERIFICATION_ATTEMPTS - storedCode.attempts
          }, { status: 400 });
        }

        // Code correct - supprimer et marquer comme vérifié
        delete emailVerificationCodes[email];
        logSecurityEvent('email_verification', 'low', request, { verified: true }, undefined, email);

        return NextResponse.json({
          success: true,
          message: 'Email vérifié avec succès!'
        });

      case 'report_registration_attempt':
        // Enregistrer une tentative d'inscription pour analyse de fraude
        const key = `${ip}_${email}_${deviceFingerprint}`;
        if (!fraudDatabase[key]) {
          fraudDatabase[key] = {
            ip,
            email,
            deviceFingerprint,
            registrationAttempts: 0,
            lastAttempt: new Date().toISOString(),
            riskScore: 0
          };
        }

        fraudDatabase[key].registrationAttempts++;
        fraudDatabase[key].lastAttempt = new Date().toISOString();
        fraudDatabase[key].riskScore = calculateFraudRisk(ip, email, deviceFingerprint);

        // Bloquer si trop de tentatives
        if (fraudDatabase[key].registrationAttempts >= SECURITY_CONFIG.MAX_REGISTRATION_ATTEMPTS_PER_IP) {
          fraudDatabase[key].blockedUntil = new Date(Date.now() + SECURITY_CONFIG.BLOCK_DURATION_MINUTES * 60 * 1000).toISOString();
          logSecurityEvent('multiple_accounts', 'high', request, {
            attempts: fraudDatabase[key].registrationAttempts,
            blocked: true
          }, undefined, email);
        }

        logSecurityEvent('multiple_accounts', 'low', request, {
          attempts: fraudDatabase[key].registrationAttempts
        }, undefined, email);

        return NextResponse.json({ recorded: true });

      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur sécurité:', error);
    return NextResponse.json(
      { error: 'Erreur interne du système de sécurité' },
      { status: 500 }
    );
  }
}

// API pour obtenir les logs de sécurité (admin seulement)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'security_logs') {
      // En production, vérifier les permissions admin
      const recentEvents = securityEvents
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 100);

      return NextResponse.json({
        events: recentEvents,
        totalEvents: securityEvents.length,
        fraudRecords: Object.keys(fraudDatabase).length
      });
    }

    if (action === 'fraud_stats') {
      const stats = {
        totalEvents: securityEvents.length,
        fraudAttempts: securityEvents.filter(e => e.type === 'fraud_attempt').length,
        multipleAccounts: securityEvents.filter(e => e.type === 'multiple_accounts').length,
        blockedIPs: Object.values(fraudDatabase).filter(r => r.blockedUntil).length,
        highRiskRecords: Object.values(fraudDatabase).filter(r => r.riskScore >= SECURITY_CONFIG.FRAUD_RISK_THRESHOLDS.HIGH).length
      };

      return NextResponse.json(stats);
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error) {
    console.error('Erreur récupération logs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données de sécurité' },
      { status: 500 }
    );
  }
}
