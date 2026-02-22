import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertPropertySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { scrapeProperty } from "./scraper";
import { sendInquiryEmail } from "./gmail";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/inquiries", async (req, res) => {
    const result = insertInquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: fromError(result.error).message });
    }
    const inquiry = await storage.createInquiry(result.data);

    try {
      await sendInquiryEmail({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        message: result.data.message,
      });
    } catch (emailErr) {
      console.error("Failed to send inquiry email:", emailErr);
    }

    return res.status(201).json(inquiry);
  });

  app.get("/api/properties", async (_req, res) => {
    const props = await storage.getProperties();
    return res.json(props);
  });

  app.get("/api/properties/featured", async (_req, res) => {
    const props = await storage.getFeaturedProperties();
    return res.json(props);
  });

  app.get("/api/properties/:slug", async (req, res) => {
    const property = await storage.getPropertyBySlug(req.params.slug);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.json(property);
  });

  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return res.status(500).json({ message: "Admin password not configured" });
    }
    if (password === adminPassword) {
      req.session.isAdmin = true;
      return res.json({ success: true });
    }
    return res.status(401).json({ message: "Invalid password" });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    return res.json({ isAdmin: !!req.session?.isAdmin });
  });

  app.get("/api/admin/inquiries", requireAdmin, async (_req, res) => {
    const inquiries = await storage.getInquiries();
    return res.json(inquiries);
  });

  app.get("/api/admin/properties", requireAdmin, async (_req, res) => {
    const props = await storage.getProperties();
    return res.json(props);
  });

  app.post("/api/admin/properties", requireAdmin, async (req, res) => {
    try {
      const result = insertPropertySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).message });
      }
      const property = await storage.createProperty(result.data);
      return res.status(201).json(property);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Failed to create property" });
    }
  });

  app.patch("/api/admin/properties/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id as string;
      const partialSchema = insertPropertySchema.partial();
      const result = partialSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromError(result.error).message });
      }
      const property = await storage.updateProperty(id, result.data);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      return res.json(property);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Failed to update property" });
    }
  });

  app.delete("/api/admin/properties/:id", requireAdmin, async (req, res) => {
    const id = req.params.id as string;
    const success = await storage.deleteProperty(id);
    if (!success) {
      return res.status(404).json({ message: "Property not found" });
    }
    return res.json({ success: true });
  });

  app.post("/api/admin/scrape", requireAdmin, async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    try {
      const scraped = await scrapeProperty(url);
      return res.json(scraped);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Failed to scrape listing" });
    }
  });

  return httpServer;
}
