import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <Hero />
      <About />
      <FeaturedListings />
      <Services />
      
      {/* Visual Break / Quote Section */}
      <section className="py-32 bg-background flex items-center justify-center text-center px-6">
        <blockquote className="max-w-3xl">
          <p className="text-3xl md:text-5xl font-serif leading-tight italic text-primary/80">
            "We shape our dwellings, and afterwards our dwellings shape us."
          </p>
          <footer className="mt-8 text-sm font-bold tracking-widest uppercase text-muted-foreground">
            — Winston Churchill
          </footer>
        </blockquote>
      </section>

      <Contact />
      
      <footer className="py-8 bg-muted border-t border-border text-center text-muted-foreground text-xs uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Mark Restelli. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
