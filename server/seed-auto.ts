import { db } from "./db";
import { properties } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const mountPleasantImages = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const server = ((n - 1) % 10) + 1;
  return `https://i${server}.moxi.onl/img-pr-002178/wpm/7d60da8668b8aa188efe296af686a5d218ad0453/${n}_2_full.jpg`;
});

const silverOakImages = Array.from({ length: 50 }, (_, i) => {
  const num = i.toString().padStart(2, "0");
  return `https://images-listings.coldwellbanker.com/PA_WPN/17/36/27/7/_P/1736277_P${num}.jpg`;
});

const carrierRdImages = [
  "https://pi.movoto.com/p/442/1618997_0_EjMFQM_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_qfyIfJ_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_mNv6Fb_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_ZJYVYf_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_BM2JVz_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_B73uNF_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_uRv32B_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_EzjUFm_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_mn2eRJ_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_YAe6y7_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_YnVjfm_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_qA2YUe_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_bFrJb7_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_ZbA2mE_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_yyRJ7Q_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_FZAvQi_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_Y3aZZi_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_YvyejQ_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_INiIFE_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_u6IyZm_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_Urvffi_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_Ea7BFA_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_fMqNbI_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_rmifUb_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_aEinuV_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_UvzAvi_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_ZBUvaM_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_aRjAze_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_3B2y2B_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_uVRbeM_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_FNUEmB_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_nQmR7M_p.webp",
  "https://pi.movoto.com/p/442/1618997_0_z2ZyZB_p.webp",
];

const sampleProperties = [
  {
    title: "809 Mount Pleasant Rd",
    slug: "809-mount-pleasant-rd",
    address: "809 Mount Pleasant Rd, Pine Twp, PA 16046",
    price: "4600000",
    bedrooms: 4,
    bathrooms: 6,
    sqft: 7310,
    imageUrl: mountPleasantImages[0],
    images: mountPleasantImages,
    description: "A custom-designed home nestled in nature offering privacy and stunning tree-lined views, featuring Sub-Zero and Wolf appliances, smart home technology, and radiant in-floor heating on 5 acres.",
    fullDescription: "Welcome to a custom-designed home nestled in nature. This home offers privacy and stunning tree-lined views, all just minutes from modern conveniences. Step inside to a stone fireplace that connects the entry and living room. The oversized dining room is ideal for hosting, while the gourmet kitchen is a chef's dream—featuring Sub-Zero refrigerator, Wolf appliances and granite waterfall countertops. The main level also includes a prep kitchen, an office with custom built-ins and plantation shutters, a spacious media room, and owner's suite. Upstairs is a private ensuite bedroom. Smart home technology and radiant in-floor heating. The lower level is a second home, complete with its own gourmet kitchen, prep kitchen, living room, office, bedrooms, laundry, and full-size windows for lots of natural light. Sliding doors open to a covered patio with gas fireplace and kitchen. For the hobbyist or professional, a detached workshop includes a bathroom. Private gated drive and multiple garages.",
    status: "active",
    mlsNumber: "1724613",
    taxes: "$46,665",
    lotSize: "5.01 acres",
    propertyType: "Single-Family Home",
    yearBuilt: "2023",
    style: "Ranch",
    schoolDistrict: "Pine/Richland",
    county: "Allegheny County",
    featured: true,
  },
  {
    title: "103 Silver Oak Ln",
    slug: "103-silver-oak-ln",
    address: "103 Silver Oak Ln, Slippery Rock Twp, PA 16057",
    price: "1200000",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3734,
    imageUrl: silverOakImages[0],
    images: silverOakImages,
    description: "A custom-built modern rustic estate on nearly 29 acres of scenic, wooded land in Slippery Rock. Built by renowned builder Dick Smith in 2019, featuring vaulted wood ceilings, open design, and a separate 2-bedroom apartment above a 3-car detached garage.",
    fullDescription: "Welcome to this exceptional custom estate set on nearly 29 acres of scenic, private, wooded land in Slippery Rock. Custom built by renowned builder Dick Smith in 2019, this property offers refined modern rustic elegance throughout its 3,734 square feet. The main residence features 4 bedrooms and 3.5 bathrooms with an open design highlighted by vaulted wood ceilings and modern rustic finishes. Every detail has been carefully considered, from the quality craftsmanship to the thoughtful floor plan that seamlessly blends indoor and outdoor living. A separate 2-bedroom, 2-bathroom apartment sits above the 3-car detached garage, perfect for guests, extended family, or rental income. The nearly 29 acres of pristine land provide unmatched privacy and endless possibilities — ideal for nature lovers, hobby farming, or equestrian use. This is one of the most unique offerings in the Slippery Rock area, combining a luxury custom home with significant acreage and a bonus living space.",
    status: "active",
    mlsNumber: "1736277",
    taxes: "",
    lotSize: "28.78 acres",
    propertyType: "Single-Family Home",
    yearBuilt: "2019",
    style: "Modern Rustic",
    schoolDistrict: "Slippery Rock Area",
    county: "Butler County",
    featured: true,
  },
  {
    title: "101 Carrier Rd",
    slug: "101-carrier-rd",
    address: "101 Carrier Rd, Transfer, PA 16154",
    price: "1850000",
    bedrooms: 10,
    bathrooms: 13,
    sqft: 13000,
    imageUrl: carrierRdImages[0],
    images: carrierRdImages,
    description: "A massive custom-built estate on 90 acres overlooking Shenango Lake. Features an indoor pool, vaulted wine cellar, cupola library, theater, fitness center, detached lodge with apartment, and a barn with 6 stables. Built with solid masonry and 40+ year metal roofs.",
    fullDescription: "Huge estate home and a detached lodge/offices/garage with 10 bedrooms total. Fun indoor pool below living room! Large barn with 6 stables. Main house features vaulted wine cellar, cupola library, fitness center, large theater, and atrium grow room. 90 Acres perfectly situated on hilltop plot with sunset views over Shenango Lake, great for ATVs and horses! Custom built solid masonry with 40+ year metal roofs. Main house features a huge commercial kitchen setup to serve large groups with serving windows to outside patio and a bulk food storage room. Located near busy Hermitage and minutes to State park, boat launch and RV park. Convenient to Pittsburgh, Youngstown, Erie and Cleveland, this property was built for weddings, executive getaways, family reunions, retreats, and more. Great potential for resident caretakers that enjoy growing, making, cooking and hosting. Lots of local farm food offerings to support operating the estate.",
    status: "sold",
    mlsNumber: "1618997",
    taxes: "$45,024",
    lotSize: "90.14 acres",
    propertyType: "Single-Family Residence",
    yearBuilt: "2000",
    style: "Multi-Level",
    schoolDistrict: "Reynolds",
    county: "Mercer County",
    featured: true,
  },
];

export async function autoSeed() {
  try {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(properties);
    const count = Number(existing[0].count);

    if (count === 0) {
      await db.insert(properties).values(sampleProperties);
      console.log("Auto-seeded 3 featured properties.");
      return;
    }

    const placeholderSlugs = ["villa-toscana", "the-wilshire-penthouse"];
    const realSlugs = sampleProperties.map(p => p.slug);

    const allProps = await db.select({ slug: properties.slug }).from(properties);
    const existingSlugs = allProps.map(p => p.slug);

    const hasPlaceholders = placeholderSlugs.some(s => existingSlugs.includes(s));
    const missingReal = realSlugs.filter(s => !existingSlugs.includes(s));

    if (hasPlaceholders || missingReal.length > 0) {
      for (const slug of placeholderSlugs) {
        if (existingSlugs.includes(slug)) {
          await db.delete(properties).where(eq(properties.slug, slug));
          console.log(`Removed placeholder property: ${slug}`);
        }
      }
      for (const prop of sampleProperties) {
        if (!existingSlugs.includes(prop.slug) || placeholderSlugs.includes(prop.slug)) {
          const exists = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.slug, prop.slug));
          if (Number(exists[0].count) === 0) {
            await db.insert(properties).values(prop);
            console.log(`Seeded real property: ${prop.slug}`);
          }
        }
      }
      return;
    }

    const featured = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.featured, true));
    const featuredCount = Number(featured[0].count);

    if (featuredCount === 0) {
      await db.update(properties).set({ featured: true });
      console.log("Marked all existing properties as featured.");
    }
  } catch (err) {
    console.error("Auto-seed check failed:", err);
  }
}
