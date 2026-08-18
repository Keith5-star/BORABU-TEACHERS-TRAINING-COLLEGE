import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Borabu Teachers Training College",
    default: "Borabu Teachers Training College | Shaping Future Educators",
  },
  description: "Official portal of Borabu Teachers Training College. Apply for Diploma in Primary Teacher Education (DPTE) and ECDE courses online.",
  keywords: ["Borabu TTC", "Teachers College Kenya", "DPTE", "DECTE", "CECTE", "Teacher Training Nyamira"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

