import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar, Home, Ruler, School, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const goNext = () => setSelectedIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative max-w-4xl mx-auto">
        <div
          className="aspect-[16/10] overflow-hidden bg-muted cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={images[selectedIndex]}
            alt={`${title} - Photo ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              data-testid="button-gallery-prev"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              data-testid="button-gallery-next"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 tracking-wide">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-6 md:grid-cols-10 gap-1 mt-1 max-w-4xl mx-auto">
          {images.slice(0, 10).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square overflow-hidden ${selectedIndex === idx ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"} transition-all`}
              data-testid={`button-thumbnail-${idx}`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {images.length > 10 && (
            <button
              onClick={() => { setSelectedIndex(10); setLightboxOpen(true); }}
              className="aspect-square bg-gray-900 text-white flex items-center justify-center text-xs font-medium"
              data-testid="button-thumbnail-more"
            >
              +{images.length - 10}
            </button>
          )}
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightboxOpen(false)} data-testid="button-lightbox-close">
            <X size={28} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            data-testid="button-lightbox-prev"
          >
            <ChevronLeft size={36} />
          </button>
          <img
            src={images[selectedIndex]}
            alt={`${title} - Photo ${selectedIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            data-testid="button-lightbox-next"
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-6 text-white/60 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

function PropertyContactForm({ propertyTitle }: { propertyTitle: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: `I'm interested in ${propertyTitle}. Please send me more information.` });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Inquiry Sent", description: "Mark will be in touch shortly." });
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Please try again.", variant: "destructive" });
    },
  });

  return (
    <div className="bg-secondary/30 border border-border p-8 md:p-10">
      <h3 className="text-2xl font-serif mb-2">Interested in This Property?</h3>
      <p className="text-muted-foreground text-sm mb-8">Reach out and Mark will get back to you with all the details.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            data-testid="input-first-name"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            data-testid="input-last-name"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          data-testid="input-email"
        />
        <textarea
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
          data-testid="input-message"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
          data-testid="button-submit-inquiry"
        >
          {mutation.isPending ? "Sending..." : "Request Information"}
        </button>
      </form>
    </div>
  );
}

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", slug],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-serif">Property Not Found</h1>
        <Link href="/" className="text-primary hover:underline text-sm uppercase tracking-widest">
          Back to Home
        </Link>
      </div>
    );
  }

  const details = [
    { icon: Home, label: "Type", value: property.propertyType },
    { icon: Calendar, label: "Year Built", value: property.yearBuilt },
    { icon: Ruler, label: "Lot Size", value: property.lotSize },
    { icon: Building2, label: "Style", value: property.style },
    { icon: School, label: "School District", value: property.schoolDistrict },
    { icon: MapPin, label: "County", value: property.county },
  ].filter((d) => d.value);

  const galleryImages = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto px-6 md:px-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group" data-testid="link-back-home">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-medium">Back to Listings</span>
          </Link>
        </div>
      </div>

      <ImageGallery images={galleryImages} title={property.title} />

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
                <div>
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 inline-block mb-4">
                    {property.status === "active" ? "For Sale" : property.status === "sold" ? "Sold" : property.status}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-serif" data-testid="text-property-title">{property.title}</h1>
                </div>
                <p className="text-3xl md:text-4xl font-serif text-primary" data-testid="text-property-price">
                  {formatPrice(property.price)}
                </p>
              </div>

              <div className="flex items-center text-muted-foreground text-sm mb-8">
                <MapPin size={14} strokeWidth={1.5} className="mr-1" />
                <span>{property.address}</span>
              </div>

              <div className="flex items-center gap-8 border-y border-border py-5 mb-10">
                <div className="flex items-center gap-2 text-sm">
                  <Bed size={18} strokeWidth={1.5} className="text-primary" />
                  <span><strong>{property.bedrooms}</strong> Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bath size={18} strokeWidth={1.5} className="text-primary" />
                  <span><strong>{property.bathrooms}</strong> Bathrooms</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Maximize size={18} strokeWidth={1.5} className="text-primary" />
                  <span><strong>{formatSqft(property.sqft)}</strong> Sq Ft</span>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">Description</h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed" data-testid="text-property-description">
                  {property.fullDescription || property.description}
                </p>
              </div>

              {details.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.map((detail) => (
                      <div key={detail.label} className="flex items-start gap-3 p-4 bg-secondary/30 border border-border">
                        <detail.icon size={18} className="text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">{detail.label}</p>
                          <p className="text-sm font-medium mt-0.5">{detail.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.mlsNumber && (
                <div className="border-t border-border pt-6 text-xs text-muted-foreground space-y-1">
                  <p>MLS # {property.mlsNumber}</p>
                  {property.taxes && <p>Annual Taxes: {property.taxes}</p>}
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
            >
              <PropertyContactForm propertyTitle={property.title} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
