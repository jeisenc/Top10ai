"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function buildAffiliateUrl(store, hint) {
  const encoded = encodeURIComponent(hint);
  switch (store) {
    case "Amazon":    return `https://www.amazon.es/s?k=${encoded}&tag=aitop10pt-21`;
    case "Worten":    return `https://www.worten.pt/search?query=${encoded}`;
    case "Fnac":      return `https://www.fnac.pt/SearchResult/ResultList.aspx?SCat=0&Search=${encoded}`;
    case "Decathlon": return `https://www.decathlon.pt/search?Ntt=${encoded}`;
    case "Zalando":   return `https://www.zalando.pt/catalog/?q=${encoded}`;
    default:          return `https://www.google.pt/search?q=${encoded}`;
  }
}

const TAG_STYLES = {
  "Melhor escolha": { bg: "#c0392b", color: "#fff" },
  "Melhor preço":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#1a5fa8", color: "#fff" },
  "Premium":        { bg: "#4a3fa0", color: "#fff" },
  "Económico":      { bg: "#7a4f00", color: "#fff" },
};

const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#8a3500" },
  Fnac:      { bg: "#fff8e0", color: "#6b4a00" },
  Amazon:    { bg: "#fff8e0", color: "#6b4a00" },
  Decathlon: { bg: "#e8f4ff", color: "#003d7a" },
  Zalando:   { bg: "#fff0f3", color: "#7a1030" },
};

const CATEGORY_EMOJI = {
  "auscultadores": "🎧",
  "robots-aspiradores": "🤖",
  "sapatilhas": "👟",
  "fritadeiras-de-ar": "🍟",
  "portateis": "💻",
  "protetor-solar": "🧴",
  "moda-verao": "👗
