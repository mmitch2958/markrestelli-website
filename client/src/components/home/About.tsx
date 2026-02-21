import { motion } from "framer-motion";
import profileImage from "@assets/image_1771008642536.png";
import { Logo } from "@/components/layout/Logo";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-primary">
              Serving My <span className="italic text-muted-foreground">Community</span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
              <p>With over 20 years of experience in real estate, Mark is passionate about helping buyers and sellers achieve their goals with hands-on diligence as a full-time REALTOR® at Coldwell Banker. His extensive background in professionally restoring and building more than fifty homes throughout the Pittsburgh area gives him a unique perspective on remodeling and new construction—knowledge he uses to guide clients through every step of the buying and selling process.
</p>
              <p>Mark also works closely with investor owners, leveraging his strong understanding of the buy-and-hold real estate market to help them make informed decisions and maximize returns.
              A proud resident of Cranberry Township, Mark and his wife CJ have raised three sons and built lifelong friendships in the community. When they’re not working, they enjoy playing pickleball as active members of the Cranberry Township Pickleball Association (CTPA), where they’ve discovered a vibrant community and a shared love for the sport’s fun and camaraderie</p>
            </div>
            <div className="mt-10 w-48 opacity-70">
              <Logo />
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <img
                src={profileImage}
                alt="Mark Restelli"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-primary/20 z-[-1]" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-l border-t border-primary/20 z-[-1]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
