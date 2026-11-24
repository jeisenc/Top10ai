import { CATEGORIES, ALL_ARTICLE_SLUGS, SITE_URL } from "../lib/site";
import { getLastUpdatedDates } from "../lib/data";

// Build the sitemap on every request. With ISR the sitemap was prerendered at
// the 29 Sep 2026 deploy and never rebuilt, so every lastmod stayed on that
// date even though the daily job refreshes guides. One small Supabase query
// per request is cheap, and Google only fetches the sitemap a few times a day.
export const dynamic = "force-dynamic";

// Articles and static pages are hand-written, so their dates are set here.
// Use the date the content last really changed (from git history), and
// update the date when you edit a page.
const ARTICLE_UPDATED = {
  "verao-2026": "2026-06-14",
  "google-modo-ia": "2026-06-14",
  "ia-vs-compras": "2026-06-14",
  "como-confiar-na-ia": "2026-04-29",
  "do-google-para-a-ia": "2026-04-29",
  "ia-em-portugal": "2026-04-29",
  "ia-e-saude": "2026-04-29",
  "ia-preve-compras": "2026-06-14",
  "mundial-2026": "2026-06-14",
};
const SOBRE_UPDATED = "2026-09-29";

function latest(dates) {
  const valid = dates.filter(Boolean).map((d) => new Date(d)).filter((d) => !isNaN(d));
  return valid.length ? new Date(Math.max(...valid)) : undefined;
}

export default async function sitemap() {
  const updated = await getLastUpdatedDates();

  // Only list guide pages that actually have content. lastmod is the time the
  // daily refresh job saved the newest list for that guide.
  const categoryPages = CATEGORIES.filter((c) => updated[c.slug]).map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: new Date(updated[c.slug]),
    changeFrequency: "weekly",
    priority: c.group === "aspiradores" ? 0.9 : 0.7,
  }));

  const articlePages = ALL_ARTICLE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/artigos/${slug}`,
    lastModified: ARTICLE_UPDATED[slug] ? new Date(ARTICLE_UPDATED[slug]) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // The homepage shows the latest lists, so it changes whenever a guide does.
  const homeUpdated = latest(Object.values(updated));

  return [
    { url: `${SITE_URL}/`, lastModified: homeUpdated, changeFrequency: "daily", priority: 1.0 },
    ...categoryPages,
    { url: `${SITE_URL}/artigos`, lastModified: latest(Object.values(ARTICLE_UPDATED)), changeFrequency: "weekly", priority: 0.5 },
    ...articlePages,
    { url: `${SITE_URL}/sobre`, lastModified: new Date(SOBRE_UPDATED), changeFrequency: "yearly", priority: 0.3 },
  ];
}
