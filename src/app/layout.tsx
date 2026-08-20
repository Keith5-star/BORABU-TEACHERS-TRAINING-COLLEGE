import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} ${lora.variable}`} data-theme="light">
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <AiAdvisorWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
