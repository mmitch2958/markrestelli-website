import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll be in touch shortly.",
      });

      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-secondary/30 border border-border p-6 lg:p-8 sticky top-8"
    >
      <h3 className="text-xl font-serif text-primary mb-2">Get in Touch</h3>
      <p className="text-muted-foreground font-light text-sm mb-6">
        Have questions? Fill out the form and I'll get back to you shortly.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</label>
          <Input
            data-testid="input-page-first-name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</label>
          <Input
            data-testid="input-page-last-name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
          <Input
            data-testid="input-page-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
          <Textarea
            data-testid="input-page-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 min-h-[120px] focus-visible:ring-primary/30"
          />
        </div>
        <Button
          data-testid="button-page-submit"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest py-6 rounded-none disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </motion.div>
  );
}
