export const OIL_TYPE_IMAGES = {
  Sunflower: "/sunfloweroil.jpeg",
  Coconut: "/coconutoil.jpeg",
  Mustard: "/mustardoil.jpeg",
  Groundnut: "/groundnutoil.jpeg",
  "Rice Bran": "/ricebranoil.jpeg"
};

const OIL_TYPE_ALIASES = [
  { key: "Sunflower", aliases: ["sunflower", "sun flower"] },
  { key: "Coconut", aliases: ["coconut", "coco nut"] },
  { key: "Mustard", aliases: ["mustard"] },
  { key: "Groundnut", aliases: ["groundnut", "ground nut", "peanut"] },
  { key: "Rice Bran", aliases: ["rice bran", "ricebran"] }
];

function cleanOilType(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getCanonicalOilType(value) {
  const cleaned = cleanOilType(value);
  const compact = cleaned.replace(/\s+/g, "");

  for (const { key, aliases } of OIL_TYPE_ALIASES) {
    if (aliases.some((alias) => {
      const aliasCompact = alias.replace(/\s+/g, "");
      return cleaned.includes(alias) || compact.includes(aliasCompact);
    })) {
      return key;
    }
  }

  return String(value || "Other")
    .trim()
    .replace(/\s+oil$/i, "") || "Other";
}

export function getOilTypeImage(value, fallback = "/oils_category.jpg") {
  return OIL_TYPE_IMAGES[getCanonicalOilType(value)] || fallback;
}
