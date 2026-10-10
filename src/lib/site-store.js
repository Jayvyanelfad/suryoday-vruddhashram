import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function getDataPath() {
  const configuredPath = process.env.SITE_CONTENT_PATH;
  if (process.env.NODE_ENV === "production" && !configuredPath) {
    throw new Error("SITE_CONTENT_PATH must point to persistent storage in production.");
  }
  return configuredPath || path.join(process.cwd(), "data", "site-content.json");
}

export const defaultSiteContent = {
  brand: {
    name: "Suryoday Vruddhashram",
    subtitle: "Care rooted in dignity, warmth, and belonging"
  },
  contact: {
    phone: "+91 9604516653",
    email: "tejaswifoundation2013@gmail.com",
    address: "Mahadeev Nagar, Dhayri, Pune 411041, India",
    whatsappMessage: "Hi! I’d like to know more about Suryoday Vruddhashram and your services.",
    mapUrl: "https://maps.google.com/?q=Mahadeev+Nagar,+Dhayri,+Pune+411041,+India"
  },
  organization: {
    tagline: "Compassionate elder care, rooted in community and dignity.",
    about: "Suryoday Vruddhashram, supported by Tejaswi Foundation, is dedicated to residential elder care, companionship, and daily wellbeing for senior citizens.",
    mission: "To support elders with respectful care, safety, nourishment, and a warm community where they can live with dignity."
  },
  needs: [
    {
      id: "nutrition",
      title: "Nutritious meals and hydration",
      description: "Fresh, balanced food and regular hydration support for residents with varied dietary requirements.",
      priority: "high"
    },
    {
      id: "medical",
      title: "Regular health checkups",
      description: "Routine monitoring, medication support, and timely medical attention for residents.",
      priority: "high"
    },
    {
      id: "companionship",
      title: "Companionship and activities",
      description: "Meaningful daily engagement, emotional support, and social activity for a happy routine.",
      priority: "medium"
    }
  ],
  stats: [
    { id: "care", value: "Care", label: "Personal care and support", description: "Respectful assistance shaped around each resident's needs." },
    { id: "meals", value: "Meals", label: "Nourishment", description: "Food and hydration support for everyday wellbeing." },
    { id: "community", value: "Community", label: "Companionship", description: "A welcoming environment for connection and belonging." }
  ],
  gallery: [
    { id: "g1", title: "Daily companionship", description: "Residents share meaningful time together in a calm, welcoming setting.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80" },
    { id: "g2", title: "Wellbeing support", description: "Compassionate care and daily routines designed around comfort.", image: "https://images.unsplash.com/photo-1544022592-4f1881e4ca34?auto=format&fit=crop&w=900&q=80" },
    { id: "g3", title: "Nutritious meals", description: "Fresh meals and hydration support for regular wellness.", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80" }
  ],
  team: [
    {
      id: "t1",
      name: "Organization leadership",
      role: "Care coordination",
      description: "Coordinates resident support and community partnerships.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "t2",
      name: "Care Team",
      role: "Resident support",
      description: "Daily personal care, empathy, and practical support for a safe, dignified routine.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "t3",
      name: "Wellbeing Team",
      role: "Health & nutrition",
      description: "Monitoring health needs, nourishment, and comfort to support better daily wellbeing.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
    }
  ]
};

async function ensureFile(dataPath) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true, mode: 0o700 });
  try {
    await fs.access(dataPath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    try {
      await fs.writeFile(dataPath, JSON.stringify(defaultSiteContent, null, 2), { encoding: "utf8", flag: "wx", mode: 0o600 });
    } catch (writeError) {
      if (writeError.code !== "EEXIST") throw writeError;
    }
  }
}

export async function readSiteContent() {
  const dataPath = getDataPath();
  await ensureFile(dataPath);
  const raw = await fs.readFile(dataPath, "utf8");
  try {
    return normalizeSiteContent(JSON.parse(raw));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("The site content file contains invalid JSON.", { cause: error });
    }
    throw error;
  }
}

function asRecord(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object.`);
  }
  return value;
}

function asText(value, field, maximumLength = 2000) {
  if (typeof value !== "string" || value.length > maximumLength) {
    throw new TypeError(`${field} must be text no longer than ${maximumLength} characters.`);
  }
  return value.trim();
}

function normalizeItems(value, defaults, field, fields) {
  if (!Array.isArray(value) || value.length > 30) {
    throw new TypeError(`${field} must be an array containing at most 30 items.`);
  }

  const ids = new Set();
  return value.map((item, index) => {
    const record = asRecord(item, `${field}[${index}]`);
    const normalized = {};
    for (const [key, maxLength] of fields) {
      normalized[key] = asText(record[key], `${field}[${index}].${key}`, maxLength);
    }
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(normalized.id) || ids.has(normalized.id)) {
      throw new TypeError(`${field}[${index}].id must be unique and contain only letters, numbers, underscores, or hyphens.`);
    }
    ids.add(normalized.id);
    if (field === "gallery" || field === "team") {
      let image;
      try {
        image = new URL(normalized.image);
      } catch {
        throw new TypeError(`${field}[${index}].image must be a valid Unsplash image URL.`);
      }
      if (image.protocol !== "https:" || image.hostname !== "images.unsplash.com") {
        throw new TypeError(`${field}[${index}].image must use https://images.unsplash.com.`);
      }
    }
    return normalized;
  }).map((item, index) => ({ ...defaults[index], ...item }));
}

export function normalizeSiteContent(nextData) {
  const input = asRecord(nextData, "Site content");
  const brand = asRecord(input.brand, "brand");
  const contact = asRecord(input.contact, "contact");
  const organization = asRecord(input.organization, "organization");
  const normalized = {
    ...defaultSiteContent,
    brand: {
      name: asText(brand.name, "brand.name", 120),
      subtitle: asText(brand.subtitle, "brand.subtitle", 240),
    },
    contact: {
      phone: asText(contact.phone, "contact.phone", 60),
      email: asText(contact.email, "contact.email", 254),
      address: asText(contact.address, "contact.address", 500),
      whatsappMessage: asText(contact.whatsappMessage, "contact.whatsappMessage", 500),
      mapUrl: asText(contact.mapUrl, "contact.mapUrl", 1000),
    },
    organization: {
      tagline: asText(organization.tagline, "organization.tagline", 240),
      about: asText(organization.about, "organization.about", 2000),
      mission: asText(organization.mission, "organization.mission", 2000),
    },
    needs: normalizeItems(input.needs, defaultSiteContent.needs, "needs", [
      ["id", 64], ["title", 160], ["description", 1000], ["priority", 20],
    ]),
    stats: normalizeItems(input.stats, defaultSiteContent.stats, "stats", [
      ["id", 64], ["value", 80], ["label", 160], ["description", 500],
    ]),
    gallery: normalizeItems(input.gallery, defaultSiteContent.gallery, "gallery", [
      ["id", 64], ["title", 160], ["description", 1000], ["image", 1000],
    ]),
    team: normalizeItems(input.team, defaultSiteContent.team, "team", [
      ["id", 64], ["name", 120], ["role", 160], ["description", 1000], ["image", 1000],
    ]),
  };

  if (!normalized.contact.phone || normalized.contact.phone.replace(/\D/g, "").length < 7) {
    throw new TypeError("contact.phone must contain at least seven digits.");
  }
  if (!normalized.contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.contact.email)) {
    throw new TypeError("contact.email must be a valid email address.");
  }
  if (!normalized.contact.address) throw new TypeError("contact.address is required.");
  let mapUrl;
  try {
    mapUrl = new URL(normalized.contact.mapUrl);
  } catch {
    throw new TypeError("contact.mapUrl must be a valid HTTPS URL.");
  }
  if (mapUrl.protocol !== "https:") throw new TypeError("contact.mapUrl must use HTTPS.");

  return normalized;
}

let pendingWrite = Promise.resolve();

export async function writeSiteContent(nextData) {
  const normalized = normalizeSiteContent(nextData);
  const operation = pendingWrite.then(async () => {
    const dataPath = getDataPath();
    await ensureFile(dataPath);
    const temporaryPath = `${dataPath}.${crypto.randomUUID()}.tmp`;
    try {
      await fs.writeFile(temporaryPath, JSON.stringify(normalized, null, 2), { encoding: "utf8", mode: 0o600 });
      await fs.rename(temporaryPath, dataPath);
    } catch (error) {
      await fs.rm(temporaryPath, { force: true }).catch(() => {});
      throw error;
    }
    return normalized;
  });
  pendingWrite = operation.catch(() => {});
  return operation;
}
