import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

const benefits = [
  "Be more likely to find the home that meets all your criteria",
  "Lessen the amount of time it will take to find your home",
  "Understand all the terms, processes and documents used when buying your home",
  "Have up-to-date market information that will allow you to make informed decisions",
  "Have a skilled negotiator working on your behalf, one who is committed to looking after your best interests",
  "Enjoy peace of mind, knowing that all the details of your purchase are being taken care of by an experienced and knowledgeable professional",
];

export default function Buying() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[40vh] min-h-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.3em] text-white/70 uppercase block mb-4"
          >
            Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-serif text-white"
          >
            Buying a Home
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group" data-testid="link-back-home">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-medium">Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-primary mb-8">How I Can Help You Buy a Home</h2>

            <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed mb-12">
              <p>
                Whether it's your first home or if you're an experienced buyer, purchasing a home is a complex process.
                By working with me, you'll find a home in the neighborhood where you want to live,
                one that fits your budget and meets your goals for features, quality and value.
              </p>
              <p>
                Once you've found the home that's right for you, I will guide you through the process of making an offer;
                negotiating the terms of the sale; getting your potential purchase inspected, repaired and appraised; and closing the sale.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-8">
                When you work with me, you will:
              </h3>
              <div className="space-y-5">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                    className="flex items-start gap-4"
                    data-testid={`benefit-buying-${idx}`}
                  >
                    <CheckCircle2 size={20} className="text-primary mt-1 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
