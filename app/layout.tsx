import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300","400","500","600","700"],
  style: ["normal","italic"],
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  style: ["normal","italic"],
});

export const metadata: Metadata = {
  title: "HealthTrack — Plataforma de Nutrição & Performance",
  description: "Conecte nutricionistas, personal trainers e clientes em um ecossistema inteligente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased bg-surface text-dark`}>
        {children}
      </body>
    </html>
  );
}
