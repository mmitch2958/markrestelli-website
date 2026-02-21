import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

const benefits = [
  "Be more likely to realize the highest return on the sale of your home",
  "Reduce the number of days your home is on the market",
  "Become familiar with all the terms, processes and paperwork involved in selling your home",
  "Have confidence that your home will enjoy exposure to more buyers and agents with qualified buyers",
  "Receive regularly updated market information that will enable you to make informed decisions",
  "Have a skilled negotiator working on your behalf",
  "Have peace of mind knowing that all the details of your sale are being handled properly by a licensed and trained professional",
];

export default function Selling() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[40vh] min-h-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')] bg-cover bg-center opacity-30" />
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
            Selling a Home
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
            <h2 className="text-2xl md:text-3xl font-serif text-primary mb-8">How I Can Help You Sell a Home</h2>

            <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed mb-12">
              <p>
                Helping find a buyer for your home is only one facet of a real estate professional's job. There are many more aspects including explaining the basic real estate practices and principles and all the related paperwork, performing a Comparative Market Analysis (CMA) to help determine your home's value, helping to prepare your home for sale, listing your home, marketing your home, and keeping you informed throughout the process.
              </p>
              <p>
                When the sale begins, it's important to work with someone who will assist you with the paperwork, negotiate on your behalf, make sure deadlines are met, and work with the escrow company.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-8">
                By working with me, you will:
              </h3>
              <div className="space-y-5">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                    className="flex items-start gap-4"
                    data-testid={`benefit-selling-${idx}`}
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
