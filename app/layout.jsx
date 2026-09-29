import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata = {
  metadataBase: new URL("https://ai10pt.top"),
  title: "ai10pt.top — Guias de compra para Portugal",
  description: "Guias de compra para Portugal: robots aspiradores, aspiradores, climatização e tecnologia, comparados e atualizados regularmente.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT" className={jakarta.variable}>
      <head>
        <meta name="google-site-verification" content="6QnVFuih8z416buOe7OoE8ux9fM78ilKEa2hhZzK2yc" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8110743153083591"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
