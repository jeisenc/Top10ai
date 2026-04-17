import CategoryPage, { CATEGORIES } from "../CategoryPage";

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ category: cat.slug }));
}

export default function Page({ params }) {
  const cat = CATEGORIES.find(c => c.slug === params.category);
  if (!cat) return <div>Categoria não encontrada.</div>;
  return <CategoryPage categoryEn={cat.en} />;
}
