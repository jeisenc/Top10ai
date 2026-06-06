"use client";

import { useState } from "react";

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
  "Melhor preco":   { bg: "#0f6e56", color: "#fff" },
  "Mais vendido":   { bg: "#1a5fa8", color: "#fff" },
  "Premium":        { bg: "#4a3fa0", color: "#fff" },
  "Economico":      { bg: "#7a4f00", color: "#fff" },
};

const STORE_COLORS = {
  Worten:    { bg: "#fff0e6", color: "#8a3500" },
  Fnac:      { bg: "#fff8e0", color: "#6b4a00" },
  Amazon:    { bg: "#fff8e0", color: "#6b4a00" },
  Decathlon: { bg: "#e8f4ff", color: "#003d7a" },
  Zalando:   { bg: "#fff0f3", color: "#7a1030" },
};

const CATEGORY_EMOJI = {
  "auscultadores": "\uD83C\uDFA7",
  "robots-aspiradores": "\uD83E\uDD16",
  "sapatilhas": "\uD83D\uDC5F",
  "fritadeiras-de-ar": "\uD83C\uDF5F",
  "portateis": "\uD83D\uDCBB",
  "protetor-solar": "\uD83E\uDDF4",
  "moda-verao": "\uD83D\uDC57",
  "ventiladores": "\uD83C\uDF00",
  "maquinas-de-cafe": "\u2615",
  "jardim": "\uD83C\uDF3F",
  "suplementos": "\uD83D\uDC8A",
  "televisores": "\uD83D\uDCFA",
  "smartphones": "\uD83D\uDCF1",
  "bicicletas": "\uD83D\uDEB2",
  "default": "\uD83D\uDED2",
};

function getCategoryEmoji(slug) {
  if (!slug) return CATEGORY_EMOJI.default;
  const key = Object.keys(CATEGORY_EMOJI).find(k => slug.includes(k));
  return
