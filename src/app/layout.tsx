import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-[Heebo]">{children}</body>
    </html>
  );
}
