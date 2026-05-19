import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quad — find your people",
  description: "Make friends at UNSW.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
