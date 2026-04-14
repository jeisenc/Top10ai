export const metadata = {
  title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
  description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
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
