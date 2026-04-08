import { NextRequest, NextResponse } from 'next/server';

// Simulated database
const referralDatabase: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerCode, newUserId, newUserName, newUserEmail } = body;

    if (!referrerCode || !newUserId) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Check if referral already exists for this user
    if (referralDatabase[newUserId]) {
      return NextResponse.json(
        { error: 'Cet utilisateur a déjà été parrainé' },
        { status: 400 }
      );
    }

    // Check for self-referral
    if (referrerCode === newUserId) {
      return NextResponse.json(
        { error: 'Auto-parrainage impossible' },
        { status: 400 }
      );
    }

    // Create referral record
    const referral = {
      id: `ref_${Date.now()}`,
      referrerCode,
      newUserId,
      newUserName,
      newUserEmail,
      createdAt: new Date().toISOString(),
      status: 'active',
      artcAmount: 10,
    };

    referralDatabase[newUserId] = referral;

    return NextResponse.json({
      success: true,
      referral,
      message: `Parrainage enregistré! ${referrerCode} gagne 10 ARTC`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du traitement du parrainage' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const referrerCode = searchParams.get('referrerCode');

    if (!referrerCode) {
      return NextResponse.json(
        { error: 'Referrer code requis' },
        { status: 400 }
      );
    }

    // Get all referrals for this referrer
    const referrals = Object.values(referralDatabase).filter(
      (ref: any) => ref.referrerCode === referrerCode
    );

    const totalEarnings = referrals.reduce(
      (sum: number, ref: any) => sum + ref.artcAmount,
      0
    );

    return NextResponse.json({
      referrerCode,
      totalReferrals: referrals.length,
      totalEarnings,
      referrals: referrals.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des parrainages' },
      { status: 500 }
    );
  }
}
