import type { Metadata } from "next";
import { Rubik, Fredoka, Varela_Round } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin", "hebrew"],
  variable: "--font-fredoka",
  display: "swap",
});

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin", "hebrew"],
  variable: "--font-varela",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SquishyAdi | הממלכה של עדי - צעצועי טרנד",
  description: "חנות הטרנדים הסודית של עדי - סקווישים, פידג'טס, נידו ועוד. כניסה לממלכה!",
  keywords: ["סקווישי", "סקוויש", "פידג'ט", "צעצועים", "טרנד", "ילדים", "עדי"],
  openGraph: {
    title: "SquishyAdi | הממלכה של עדי",
    description: "חנות הטרנדים הסודית של עדי - כניסה לממלכה!",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`h-full antialiased ${rubik.variable} ${fredoka.variable} ${varelaRound.variable}`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Rubik', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
