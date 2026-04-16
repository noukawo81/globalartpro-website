import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { PiProvider } from "@/context/PiContext";
import { AuthProvider } from "@/context/AuthContext";
import { PiMockProvider } from "@/components/PiMockProvider";
import TestnetBanner from '@/components/TestnetBanner';
import { config } from '@/lib/config';
import "./globals.css";
import AIAssistant from '@/components/ui/AIAssistant';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `GlobalArtPro - ${config.currency.name}`,
  description: `Plateforme d'art digital utilisant ${config.currency.name}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        <PiMockProvider>
          <AuthProvider>
            <PiProvider>
              <TestnetBanner />
              {/* Desktop Navbar */}
              <div className="hidden md:block">
                <Suspense fallback={<div className="h-20 bg-gray-900" />}>
                  <Navbar />
                </Suspense>
              </div>

              {/* Mobile Header */}
              <MobileHeader />
              
              <main className="pt-16 sm:pt-20 md:pt-16 pb-16 md:pb-0 flex-1">
                {children}
              </main>
              
              {/* Mobile Bottom Navigation */}
              <BottomNav />
              
              {/* Footer */}
              <Footer />
              
              <Suspense fallback={null}>
                <AIAssistant />
              </Suspense>
            </PiProvider>
          </AuthProvider>
        </PiMockProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.GLOBALARTPRO_CONFIG = ${JSON.stringify(config)}; console.log('🌐 GlobalArtPro config:', window.GLOBALARTPRO_CONFIG);`,
          }}
        />
      </body>
    </html>
  );
}
