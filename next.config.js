const { retired } = require("./lib/categories.json");

/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    // Old auto-generated categories: merge into the page that replaces them,
    // or send to the homepage when nothing replaces them.
    return Object.entries(retired).map(([slug, target]) => ({
      source: `/${slug}`,
      destination: target ? `/${target}` : "/",
      permanent: true,
    }));
  },
};
