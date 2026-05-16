import CategoryPage from "../CategoryPage";

export default async function Page({ params }) {
  const { category } = await params;
  return <CategoryPage slug={category} />;
}
