import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function formatSqft(sqft: number) {
  return new Intl.NumberFormat("en-US").format(sqft);
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const slug = property.slug || property.id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      data-testid={`card-property-${property.id}`}
      className="group cursor-pointer"
    >
      <Link href={`/property/${slug}`} className="block">
        <div className="relative overflow-hidden aspect-[16/10] bg-muted">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5">
              {property.status === "active" ? "For Sale" : property.status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-3xl font-serif">{formatPrice(property.price)}</p>
          </div>
        </div>

        <div className="py-5">
          <h3 className="text-xl font-serif mb-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin size={14} strokeWidth={1.5} className="mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Bed size={16} strokeWidth={1.5} />
                {property.bedrooms} Beds
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={16} strokeWidth={1.5} />
                {property.bathrooms} Baths
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize size={16} strokeWidth={1.5} />
                {formatSqft(property.sqft)} Sq Ft
              </span>
            </div>
            <span className="text-lg font-serif font-medium">{formatPrice(property.price)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedListings() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
    queryFn: async () => {
      const res = await fetch("/api/properties/featured");
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  return (
    <section id="lifestyle" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mt-4">Featured Properties</h2>
          <p className="mt-4 text-muted-foreground text-lg font-light">
            A curated selection of exceptional residences
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-muted rounded" />
                <div className="py-5 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No properties available at this time.</p>
        )}
      </div>
    </section>
  );
}
