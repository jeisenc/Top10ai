import CategoryPage from "./CategoryPage";

export const revalidate = 3600;

export default function Home() {
  return <CategoryPage categoryEn="wireless-headphones" />;
}
