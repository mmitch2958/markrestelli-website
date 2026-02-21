import { Home, Compass, Feather, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
  {
    icon: Home,
    title: "Real Estate",
    description: "Acquisition and sales of premier residential properties across the globe's most coveted destinations.",
  },
  {
    icon: Compass,
    title: "Niche",
    description: "A popular platform used by students and families to research K-12 schools, colleges, and graduate programs.",
    link: "https://www.niche.com/k12/search/best-schools/m/pittsburgh-metro-area/",
  },
  {
    icon: Feather,
    title: "Design",
    description: "Interior curation and architectural consulting to transform spaces into personal sanctuaries.",
  },
];

const serviceLinks = [
  { name: "Buying", href: "/buying", description: "Expert guidance through every step of purchasing your dream home" },
  { name: "Selling", href: "/selling", description: "Maximize your return with a strategic, full-service selling experience" },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Expertise</span>
          <h2 className="text-3xl md:text-4xl font-serif mt-4">Curated Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const content = (
              <>
                <div className="mb-6 text-primary/80 group-hover:text-primary transition-colors">
                  <service.icon size={32} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-serif mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.description}
                </p>
              </>
            );
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                {service.link ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-8 bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
                    data-testid={`link-service-${service.title.toLowerCase()}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group p-8 bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {serviceLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <Link
                href={link.href}
                className="group flex items-center justify-between p-6 bg-background border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md"
                data-testid={`link-service-${link.name.toLowerCase()}`}
              >
                <div>
                  <h4 className="text-lg font-serif mb-1">{link.name}</h4>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight size={20} className="text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
