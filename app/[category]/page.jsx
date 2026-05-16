import CategoryPage from "../CategoryPage";

export default function Page({ params }) {
  return <CategoryPage slug={params.category} />;
}
