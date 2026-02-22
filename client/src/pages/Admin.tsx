import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Property, Inquiry } from "@shared/schema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPrice(price: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

const emptyForm = {
  title: "",
  slug: "",
  address: "",
  price: "",
  bedrooms: 0,
  bathrooms: 0,
  sqft: 0,
  description: "",
  fullDescription: "",
  status: "active",
  mlsNumber: "",
  taxes: "",
  lotSize: "",
  propertyType: "",
  yearBuilt: "",
  style: "",
  schoolDistrict: "",
  county: "",
  featured: false,
  imageUrl: "",
  images: [] as string[],
};

type PropertyForm = typeof emptyForm;

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("POST", "/api/admin/login", { password });
      onLogin();
    } catch {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-border bg-card">
        <h1 className="text-2xl font-serif mb-6 text-center" data-testid="text-login-title">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            data-testid="input-admin-password"
            required
          />
          {error && <p className="text-red-500 text-sm" data-testid="text-login-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
            data-testid="button-admin-login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ImageManager({
  imageUrl,
  images,
  onSetMainImage,
  onAddImage,
  onRemoveImage,
}: {
  imageUrl: string;
  images: string[];
  onSetMainImage: (url: string) => void;
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
}) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const allImages = [imageUrl, ...images.filter((img) => img && img !== imageUrl)].filter(Boolean);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">Images</label>
      {allImages.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {allImages.map((img, idx) => {
            const isMain = img === imageUrl;
            const galleryIdx = images.indexOf(img);
            return (
              <div key={idx} className="relative group aspect-square">
                <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover border border-border" />
                {isMain && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 font-bold uppercase">Main</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => onSetMainImage(img)}
                      className="text-white text-[10px] bg-primary px-1.5 py-0.5 uppercase tracking-wider"
                      data-testid={`button-set-main-image-${idx}`}
                      title="Set as main image"
                    >
                      ★
                    </button>
                  )}
                  {!isMain && galleryIdx >= 0 && (
                    <button
                      type="button"
                      onClick={() => onRemoveImage(galleryIdx)}
                      className="text-white text-[10px] bg-red-600 px-1.5 py-0.5 uppercase tracking-wider"
                      data-testid={`button-remove-image-${idx}`}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add image URL..."
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          data-testid="input-add-image-url"
        />
        <button
          type="button"
          onClick={() => {
            if (newImageUrl.trim()) {
              onAddImage(newImageUrl.trim());
              setNewImageUrl("");
            }
          }}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors"
          data-testid="button-add-image"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PropertyEditor({
  property,
  onClose,
}: {
  property: Property | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const isEditing = !!property;

  const [form, setForm] = useState<PropertyForm>(() => {
    if (property) {
      return {
        title: property.title || "",
        slug: property.slug || "",
        address: property.address || "",
        price: String(property.price || ""),
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        sqft: property.sqft || 0,
        description: property.description || "",
        fullDescription: property.fullDescription || "",
        status: property.status || "active",
        mlsNumber: property.mlsNumber || "",
        taxes: property.taxes || "",
        lotSize: property.lotSize || "",
        propertyType: property.propertyType || "",
        yearBuilt: property.yearBuilt || "",
        style: property.style || "",
        schoolDistrict: property.schoolDistrict || "",
        county: property.county || "",
        featured: property.featured || false,
        imageUrl: property.imageUrl || "",
        images: property.images || [],
      };
    }
    return { ...emptyForm };
  });

  const [scrapeUrl, setScrapeUrl] = useState("");

  const scrapeMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await apiRequest("POST", "/api/admin/scrape", { url });
      return res.json();
    },
    onSuccess: (data: any) => {
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || slugify(data.title || prev.title),
        address: data.address || prev.address,
        price: String(data.price || prev.price),
        bedrooms: data.bedrooms ?? prev.bedrooms,
        bathrooms: data.bathrooms ?? prev.bathrooms,
        sqft: data.sqft ?? prev.sqft,
        description: data.description || prev.description,
        fullDescription: data.fullDescription || prev.fullDescription,
        status: data.status || prev.status,
        mlsNumber: data.mlsNumber || prev.mlsNumber,
        taxes: data.taxes || prev.taxes,
        lotSize: data.lotSize || prev.lotSize,
        propertyType: data.propertyType || prev.propertyType,
        yearBuilt: data.yearBuilt || prev.yearBuilt,
        style: data.style || prev.style,
        schoolDistrict: data.schoolDistrict || prev.schoolDistrict,
        county: data.county || prev.county,
        imageUrl: data.imageUrl || prev.imageUrl,
        images: data.images || prev.images,
      }));
      toast({ title: "Scraped", description: "Form populated with listing data." });
    },
    onError: (err: Error) => {
      toast({ title: "Scrape Failed", description: err.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: PropertyForm) => {
      const payload = {
        ...data,
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        sqft: Number(data.sqft),
      };
      if (isEditing) {
        const res = await apiRequest("PATCH", `/api/admin/properties/${property.id}`, payload);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/admin/properties", payload);
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({ title: isEditing ? "Updated" : "Created", description: "Property saved successfully." });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateField = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !isEditing) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const inputClass = "w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors";
  const labelClass = "block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-card border border-border w-full max-w-3xl mx-4 my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-serif" data-testid="text-editor-title">
            {isEditing ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg"
            data-testid="button-close-editor"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!isEditing && (
            <div className="bg-secondary/30 border border-border p-4 space-y-3">
              <label className={labelClass}>Scrape from URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://markrestelli.com/listing/..."
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  className={`flex-1 ${inputClass}`}
                  data-testid="input-scrape-url"
                />
                <button
                  type="button"
                  onClick={() => scrapeUrl && scrapeMutation.mutate(scrapeUrl)}
                  disabled={scrapeMutation.isPending || !scrapeUrl}
                  className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                  data-testid="button-scrape-listing"
                >
                  {scrapeMutation.isPending ? "Scraping..." : "Scrape Listing"}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} data-testid="input-title" required />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input type="text" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className={inputClass} data-testid="input-slug" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} data-testid="input-address" required />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Price</label>
              <input type="text" value={form.price} onChange={(e) => updateField("price", e.target.value)} className={inputClass} data-testid="input-price" required />
            </div>
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => updateField("bedrooms", Number(e.target.value))} className={inputClass} data-testid="input-bedrooms" />
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => updateField("bathrooms", Number(e.target.value))} className={inputClass} data-testid="input-bathrooms" />
            </div>
            <div>
              <label className={labelClass}>Sq Ft</label>
              <input type="number" value={form.sqft} onChange={(e) => updateField("sqft", Number(e.target.value))} className={inputClass} data-testid="input-sqft" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={2} className={`${inputClass} resize-none`} data-testid="input-description" />
          </div>

          <div>
            <label className={labelClass}>Full Description</label>
            <textarea value={form.fullDescription} onChange={(e) => updateField("fullDescription", e.target.value)} rows={5} className={`${inputClass} resize-none`} data-testid="input-full-description" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass} data-testid="select-status">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type</label>
              <select value={form.propertyType} onChange={(e) => updateField("propertyType", e.target.value)} className={inputClass} data-testid="select-property-type">
                <option value="">Select...</option>
                <option value="Single-Family Home">Single-Family Home</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Land">Land</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Style</label>
              <select value={form.style} onChange={(e) => updateField("style", e.target.value)} className={inputClass} data-testid="select-style">
                <option value="">Select...</option>
                <option value="Ranch">Ranch</option>
                <option value="Colonial">Colonial</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Victorian">Victorian</option>
                <option value="Modern">Modern</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Tudor">Tudor</option>
                <option value="Cape Cod">Cape Cod</option>
                <option value="Craftsman">Craftsman</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>MLS Number</label>
              <input type="text" value={form.mlsNumber} onChange={(e) => updateField("mlsNumber", e.target.value)} className={inputClass} data-testid="input-mls-number" />
            </div>
            <div>
              <label className={labelClass}>Taxes</label>
              <input type="text" value={form.taxes} onChange={(e) => updateField("taxes", e.target.value)} className={inputClass} data-testid="input-taxes" />
            </div>
            <div>
              <label className={labelClass}>Lot Size</label>
              <input type="text" value={form.lotSize} onChange={(e) => updateField("lotSize", e.target.value)} className={inputClass} data-testid="input-lot-size" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Year Built</label>
              <input type="text" value={form.yearBuilt} onChange={(e) => updateField("yearBuilt", e.target.value)} className={inputClass} data-testid="input-year-built" />
            </div>
            <div>
              <label className={labelClass}>School District</label>
              <input type="text" value={form.schoolDistrict} onChange={(e) => updateField("schoolDistrict", e.target.value)} className={inputClass} data-testid="input-school-district" />
            </div>
            <div>
              <label className={labelClass}>County</label>
              <input type="text" value={form.county} onChange={(e) => updateField("county", e.target.value)} className={inputClass} data-testid="input-county" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4 accent-primary"
              data-testid="input-featured"
            />
            <label htmlFor="featured" className="text-sm">Show on Homepage Featured Section</label>
          </div>

          <div>
            <label className={labelClass}>Main Image URL</label>
            <input type="text" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} className={inputClass} data-testid="input-image-url" />
          </div>

          <ImageManager
            imageUrl={form.imageUrl}
            images={form.images}
            onSetMainImage={(url) => updateField("imageUrl", url)}
            onAddImage={(url) => setForm((prev) => ({ ...prev, images: [...prev.images, url] }))}
            onRemoveImage={(idx) => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
          />

          <div>
            <label className={labelClass}>Gallery Images (one URL per line)</label>
            <textarea
              value={form.images.join("\n")}
              onChange={(e) => updateField("images", e.target.value.split("\n").filter((line) => line.trim()))}
              rows={4}
              className={`${inputClass} resize-none font-mono text-xs`}
              data-testid="input-images-textarea"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
              data-testid="button-save-property"
            >
              {saveMutation.isPending ? "Saving..." : isEditing ? "Update Property" : "Create Property"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-border px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-secondary/50 transition-colors"
              data-testid="button-cancel-editor"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  property,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  property: Property;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-card border border-border p-8 max-w-md mx-4 w-full">
        <h3 className="text-lg font-serif mb-2" data-testid="text-delete-confirm-title">Delete Property</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Are you sure you want to delete <strong>{property.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white px-5 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
            data-testid="button-confirm-delete"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-secondary/50 transition-colors"
            data-testid="button-cancel-delete"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "leads">("properties");

  const sessionQuery = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/session"],
    queryFn: async () => {
      const res = await fetch("/api/admin/session", { credentials: "include" });
      return res.json();
    },
  });

  useEffect(() => {
    if (sessionQuery.data !== undefined) {
      setIsLoggedIn(sessionQuery.data.isAdmin);
      setSessionChecked(true);
    }
  }, [sessionQuery.data]);

  const propertiesQuery = useQuery<Property[]>({
    queryKey: ["/api/admin/properties"],
    queryFn: async () => {
      const res = await fetch("/api/admin/properties", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: isLoggedIn,
  });

  const inquiriesQuery = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/admin/inquiries", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
    enabled: isLoggedIn && activeTab === "leads",
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      toast({ title: "Deleted", description: "Property removed successfully." });
      setDeletingProperty(null);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      setIsLoggedIn(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
    } catch {
      toast({ title: "Error", description: "Failed to logout", variant: "destructive" });
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginForm
        onLogin={() => {
          setIsLoggedIn(true);
          queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
        }}
      />
    );
  }

  const properties = propertiesQuery.data || [];
  const inquiries = inquiriesQuery.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <h1 className="text-xl font-serif" data-testid="text-admin-title">Admin Dashboard</h1>
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab("properties")}
              className={`text-sm uppercase tracking-widest transition-colors ${activeTab === "properties" ? "text-white border-b border-primary" : "text-white/60 hover:text-white"}`}
            >
              Properties
            </button>
            <button 
              onClick={() => setActiveTab("leads")}
              className={`text-sm uppercase tracking-widest transition-colors ${activeTab === "leads" ? "text-white border-b border-primary" : "text-white/60 hover:text-white"}`}
            >
              Leads
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white text-sm uppercase tracking-widest transition-colors"
            data-testid="button-logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-8">
        {activeTab === "properties" ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-serif" data-testid="text-properties-heading">Properties ({properties.length})</h2>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowEditor(true);
                }}
                className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-primary/90 transition-colors"
                data-testid="button-add-property"
              >
                Add New Property
              </button>
            </div>

            {propertiesQuery.isLoading ? (
              <div className="text-muted-foreground animate-pulse">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground" data-testid="text-no-properties">
                <p className="text-lg mb-2">No properties yet</p>
                <p className="text-sm">Click "Add New Property" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {properties.map((prop) => (
                  <div
                    key={prop.id}
                    className="flex items-center gap-4 border border-border p-4 hover:bg-secondary/20 transition-colors"
                    data-testid={`card-property-${prop.id}`}
                  >
                    {prop.imageUrl && (
                      <img src={prop.imageUrl} alt={prop.title} className="w-16 h-16 object-cover flex-shrink-0 border border-border" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base truncate" data-testid={`text-property-title-${prop.id}`}>{prop.title}</h3>
                        {prop.featured && (
                          <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider flex-shrink-0" data-testid={`badge-featured-${prop.id}`}>
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate" data-testid={`text-property-address-${prop.id}`}>{prop.address}</p>
                      <p className="text-sm text-primary font-medium" data-testid={`text-property-price-${prop.id}`}>{formatPrice(String(prop.price))}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingProperty(prop);
                          setShowEditor(true);
                        }}
                        className="border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-wider hover:bg-secondary/50 transition-colors"
                        data-testid={`button-edit-property-${prop.id}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingProperty(prop)}
                        className="border border-red-300 text-red-600 px-3 py-1.5 text-xs font-medium uppercase tracking-wider hover:bg-red-50 transition-colors"
                        data-testid={`button-delete-property-${prop.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-serif">Inbound Leads ({inquiries.length})</h2>
            </div>

            {inquiriesQuery.isLoading ? (
              <div className="text-muted-foreground animate-pulse">Loading leads...</div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg mb-2">No leads yet</p>
                <p className="text-sm">New messages from the contact form will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border border-border p-6 bg-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-serif text-lg">{inquiry.firstName} {inquiry.lastName}</h3>
                        <p className="text-sm text-primary">{inquiry.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-secondary/20 p-4 border-l-2 border-primary">
                      <p className="text-sm italic text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        "{inquiry.message}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showEditor && (
        <PropertyEditor
          property={editingProperty}
          onClose={() => {
            setShowEditor(false);
            setEditingProperty(null);
          }}
        />
      )}

      {deletingProperty && (
        <DeleteConfirmDialog
          property={deletingProperty}
          onConfirm={() => deleteMutation.mutate(deletingProperty.id)}
          onCancel={() => setDeletingProperty(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
