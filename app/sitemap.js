import { CATEGORIES, ALL_ARTICLE_SLUGS, SITE_URL } from "../lib/site";
import { getLatestLists } from "../lib/data";

export const revalidate = 3600;

export default async function sitemap() {
  const lists = await getLatestLists();

  // Only list category pages that actually have content.
  const categoryPages = CATEGORIES.filter((c) => lists[c.slug]).map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: new Date(lists[c.slug].created_at),
    changeFrequency: "weekly",
    priority: c.group === "aspiradores" ? 0.9 : 0.7,
  }));

  const articlePages = ALL_ARTICLE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/artigos/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    ...categoryPages,
    { url: `${SITE_URL}/artigos`, changeFrequency: "weekly", priority: 0.5 },
    ...articlePages,
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
