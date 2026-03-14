import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const lora = localFont({
  src: "../public/fonts/Lora-Variable.ttf",
  variable: "--font-lora",
  display: "swap",
});

const lilex = localFont({
  src: "../public/fonts/Lilex-Variable.ttf",
  variable: "--font-lilex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Archon",
  description: "Cloud architecture AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${lilex.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
