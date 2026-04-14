export const metadata = {
  title: "AI Top 10 Portugal — Os melhores produtos selecionados por IA",
  description: "Os 10 melhores produtos disponíveis em Portugal hoje, selecionados por inteligência artificial.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
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
