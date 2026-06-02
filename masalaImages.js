export const MASALA_IMAGE_FALLBACK = "/spices_category.jpg";

export const MASALA_IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp", ".jfif", ".jpef"];

const MASALA_IMAGE_ALIASES = [
  {
    image: "/Niharichickenmasala.jpeg",
    aliases: ["chicken masala", "nihari chicken masala", "nihari masala", "niharichickenmasala"]
  },
  {
    image: "/kababmasala.jpeg",
    aliases: ["kabab masala", "kabob masala", "kebab masala"]
  },
  {
    image: "/Dhaniyapowder.jpeg",
    aliases: ["dhaniya powder", "dhainya powder", "dhania powder", "coriander powder", "dhaniyapowder"]
  },
  {
    image: "/chillipowder.jpeg",
    aliases: ["chilli powder", "chili powder", "red chilli powder", "red chili powder", "mirchi powder"]
  },
  {
    image: "/turmeric.jpeg",
    aliases: ["turmeric powder", "turmeric", "haldi powder", "haldi"]
  },
  {
    image: "/Garammasala.jpeg",
    aliases: ["garam masala", "garammasala"]
  },
  {
    image: "/rasampowder.jpeg",
    aliases: ["rasam powder", "rasam"]
  },
  {
    image: "/sambar.jpeg",
    aliases: ["sambar", "sambar powder", "sambarpowder"]
  },
  {
    image: "/mutton.jpeg",
    aliases: ["mutton", "mutton masala", "muttonmasala"]
  }
];

export function normalizeMasalaKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function getMasalaImage(value, fallback = MASALA_IMAGE_FALLBACK) {
  const key = normalizeMasalaKey(value);
  if (!key) return fallback;

  const match = MASALA_IMAGE_ALIASES.find(({ aliases }) =>
    aliases.some((alias) => {
      const aliasKey = normalizeMasalaKey(alias);
      return key === aliasKey || key.includes(aliasKey) || aliasKey.includes(key);
    })
  );

  return match ? match.image : fallback;
}
