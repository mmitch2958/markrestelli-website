import * as cheerio from "cheerio";

interface ScrapedProperty {
  title: string;
  slug: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  images: string[];
  description: string;
  fullDescription: string;
  mlsNumber: string;
  taxes: string;
  lotSize: string;
  propertyType: string;
  yearBuilt: string;
  style: string;
  schoolDistrict: string;
  county: string;
  status: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function discoverMoxiImages(baseImageUrl: string): Promise<string[]> {
  const match = baseImageUrl.match(
    /https:\/\/i\d+\.moxi\.onl\/([^/]+\/[^/]+\/[^/]+)\/\d+_\d+_\w+\.\w+/
  );
  if (!match) return [baseImageUrl];

  const basePath = match[1];
  const images: string[] = [];

  for (let i = 1; i <= 50; i++) {
    const server = ((i - 1) % 10) + 1;
    const url = `https://i${server}.moxi.onl/${basePath}/${i}_2_full.jpg`;
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        images.push(url);
      } else {
        break;
      }
    } catch {
      break;
    }
  }

  return images.length > 0 ? images : [baseImageUrl];
}

export async function scrapeProperty(url: string): Promise<ScrapedProperty> {
  const allowedDomains = ["markrestelli.com", "www.markrestelli.com"];
  const parsedUrl = new URL(url);
  if (!allowedDomains.includes(parsedUrl.hostname)) {
    throw new Error("Only markrestelli.com URLs are supported");
  }

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PropertyScraper/1.0)" },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listing: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const titleEl = $("h1").first().text().trim();
  const parts = titleEl.split(/\s+/);
  const stateIdx = parts.findIndex((p) => p.length === 2 && p === p.toUpperCase() && /^[A-Z]{2}$/.test(p));
  let street = titleEl;
  let city = "";
  let state = "";
  let zip = "";

  if (stateIdx > 0) {
    const beforeState = parts.slice(0, stateIdx);
    const commaIdx = beforeState.findIndex((p) => p.endsWith(","));
    if (commaIdx >= 0) {
      street = beforeState.slice(0, commaIdx).join(" ");
      city = beforeState
        .slice(commaIdx)
        .join(" ")
        .replace(/,$/, "");
    } else {
      street = beforeState.join(" ");
    }
    state = parts[stateIdx];
    zip = parts[stateIdx + 1] || "";
  }

  const title = street || titleEl.split(",")[0]?.trim() || titleEl;
  const fullAddress = titleEl;

  let price = "0";
  const priceText = $('*:contains("$")').filter(function () {
    return $(this).children().length === 0 && /\$[\d,]+/.test($(this).text());
  }).first().text();
  const priceMatch = priceText.match(/\$([\d,]+)/);
  if (priceMatch) {
    price = priceMatch[1].replace(/,/g, "");
  }

  let bedrooms = 0;
  let bathrooms = 0;
  let sqft = 0;

  const pageText = $.text();

  const bedMatch = pageText.match(/(\d+)\s*BED/i);
  if (bedMatch) bedrooms = parseInt(bedMatch[1]);

  const bathMatch = pageText.match(/(\d+)\s*BATH/i);
  if (bathMatch) bathrooms = parseInt(bathMatch[1]);

  const sqftMatch = pageText.match(/([\d,]+)\s*SQFT/i);
  if (sqftMatch) sqft = parseInt(sqftMatch[1].replace(/,/g, ""));

  let description = "";
  const descEl = $('*:contains("Description")').parent().find("p, div").filter(function () {
    const text = $(this).text().trim();
    return text.length > 100 && !text.includes("Copyright") && !text.includes("Disclaimer");
  }).first();
  
  if (descEl.length) {
    description = descEl.text().trim();
  }
  
  if (!description) {
    $("p, div").each(function () {
      const text = $(this).text().trim();
      if (text.length > 200 && !text.includes("Copyright") && !text.includes("Disclaimer") && !text.includes("reCAPTCHA")) {
        description = text;
        return false;
      }
    });
  }

  let mlsNumber = "";
  const mlsMatch = pageText.match(/MLS\s*#[:\s]*([\w]+)/i);
  if (mlsMatch) mlsNumber = mlsMatch[1];

  let taxes = "";
  const taxMatch = pageText.match(/Taxes[:\s]*\$?([\d,]+)/i);
  if (taxMatch) taxes = `$${taxMatch[1]}`;

  let lotSize = "";
  const lotMatch = pageText.match(/Lot\s*Size[:\s]*([\d.]+\s*acres?)/i);
  if (lotMatch) lotSize = lotMatch[1];

  let propertyType = "";
  const typeMatch = pageText.match(/Type[:\s]*(Single-Family Home|Condo|Townhouse|Multi-Family|Land)/i);
  if (typeMatch) propertyType = typeMatch[1];

  let yearBuilt = "";
  const yearMatch = pageText.match(/Year\s*Built[:\s]*(\d{4})/i);
  if (yearMatch) yearBuilt = yearMatch[1];

  let style = "";
  const styleMatch = pageText.match(/Style[:\s]*([\w\s-]+?)(?:\n|$)/i);
  if (styleMatch) style = styleMatch[1].trim();

  let schoolDistrict = "";
  const schoolMatch = pageText.match(/School\s*District[:\s]*([\w\s/]+?)(?:\n|$)/i);
  if (schoolMatch) schoolDistrict = schoolMatch[1].trim();

  let county = "";
  const countyMatch = pageText.match(/County[:\s]*([\w\s]+County)/i);
  if (countyMatch) county = countyMatch[1].trim();

  let moxiBaseUrl = "";
  const imgUrls: string[] = [];
  $("img").each(function () {
    const src = $(this).attr("src") || "";
    if (src.includes("moxi.onl") && src.includes("_2_")) {
      imgUrls.push(src);
      if (!moxiBaseUrl) moxiBaseUrl = src;
    }
  });

  const srcsetUrls: string[] = [];
  $("[srcset], [data-srcset]").each(function () {
    const srcset = $(this).attr("srcset") || $(this).attr("data-srcset") || "";
    const matches = srcset.match(/https:\/\/i\d+\.moxi\.onl\/[^\s,]+/g);
    if (matches) srcsetUrls.push(...matches);
  });

  const styleBgUrls: string[] = [];
  $("[style]").each(function () {
    const s = $(this).attr("style") || "";
    const m = s.match(/url\(['"]?(https:\/\/i\d+\.moxi\.onl\/[^'")\s]+)/g);
    if (m) styleBgUrls.push(...m.map((u) => u.replace(/url\(['"]?/, "")));
  });

  const allMoxiUrls = [...imgUrls, ...srcsetUrls, ...styleBgUrls];
  const firstMoxi = allMoxiUrls[0] || "";

  let images: string[] = [];
  if (firstMoxi) {
    images = await discoverMoxiImages(firstMoxi);
  }

  const slug = slugify(title);

  return {
    title,
    slug,
    address: fullAddress,
    price,
    bedrooms,
    bathrooms,
    sqft,
    imageUrl: images[0] || "",
    images,
    description: description.substring(0, 300),
    fullDescription: description,
    mlsNumber,
    taxes,
    lotSize,
    propertyType,
    yearBuilt,
    style,
    schoolDistrict,
    county,
    status: "active",
  };
}
