import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Heart, Shield, Users, Mail, Phone } from "lucide-react";

interface FooterProps {
  onTryAgain: () => void;
}

export const Footer = ({ onTryAgain }: FooterProps) => {
  return (
    <footer className="bg-gradient-to-t from-primary/5 to-background py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-accent mr-3" />
                <h3 className="text-xl font-bold text-primary">INSIGHTMIND</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Revolutionizing insurance decisions with ethical AI that thinks, 
                explains, and decides with complete transparency.
              </p>
              <div className="flex space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 text-accent" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 text-accent" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
            </div>

            {/* About RAJAN */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">About RAJAN</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 2,000+ real claim decisions</li>
                <li>• Ethical decision framework</li>
                <li>• Complete transparency</li>
                <li>• Multi-language support</li>
                <li>• Accessibility focused</li>
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Voice interaction</li>
                <li>• Document analysis</li>
                <li>• Real-time processing</li>
                <li>• Decision explanation</li>
                <li>• Clause verification</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2 text-accent" />
                  support@insightmind.ai
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2 text-accent" />
                  1-800-INSIGHT
                </div>
                <div className="text-xs text-muted-foreground">
                  Available 24/7 for ethical AI support
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-2">
                © 2024 INSIGHTMIND. All rights reserved.
              </p>
              <motion.p 
                className="text-sm font-medium text-accent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                "Ethics &gt; Algorithms. RAJAN AI never guesses."
              </motion.p>
            </div>

            {/* Try Again CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onTryAgain}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 rounded-xl shadow-neumorphism hover:shadow-neumorphism-inset transition-all duration-300"
              >
                Try Another Case
              </Button>
            </motion.div>
          </div>

          {/* Team Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 pt-6 border-t border-border/50"
          >
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Built with ❤️ by the INSIGHTMIND Team
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span>AI Ethics Team</span>
                <span>•</span>
                <span>UX Accessibility Team</span>
                <span>•</span>
                <span>Insurance Domain Experts</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};