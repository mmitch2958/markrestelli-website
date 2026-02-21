import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import bibzaLogo from "@assets/Bibza_rgb_Logo_Horiz_Black_1771629058218.png";

export function Contact() {
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
    <section id="contact" className="py-24 text-foreground bg-[#f2bc33bf]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-8">Begin the Conversation</h2>
            <p className="text-muted-foreground font-light text-lg max-w-md leading-relaxed mb-12">
              Whether you are looking to acquire a new property or elevate your current lifestyle, we are here to assist.
            </p>
            
            <div className="space-y-2 text-foreground/80 font-serif">
              <p>Mark@Bibzagroup.com</p>
              <p>+1 412.977.6800</p>
              <p>Cranberry Township, PA</p>
            </div>
            <div className="mt-8 flex items-center gap-6">
              <img src={bibzaLogo} alt="Bibza Group Logo" className="w-48" />
              <div className="text-foreground/80 font-serif text-sm leading-relaxed">
                <p className="font-bold">Coldwell Banker</p>
                <p>20510 Route 19, Suite 101</p>
                <p>Cranberry Township, PA 16066</p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</label>
                <Input
                  data-testid="input-first-name"
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
                  data-testid="input-last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
              <Input
                data-testid="input-email"
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
                data-testid="input-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-transparent border-foreground/20 text-foreground placeholder:text-foreground/30 min-h-[150px] focus-visible:ring-primary/30"
              />
            </div>
            <Button
              data-testid="button-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest py-6 px-8 rounded-none disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
