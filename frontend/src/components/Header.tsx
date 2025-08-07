import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";

interface HeaderProps {
  onBackToHome?: () => void;
  showBackButton?: boolean;
}

export const Header = ({ onBackToHome, showBackButton = true }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 glass backdrop-blur-xl border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Brain className="w-8 h-8 text-accent mr-3" />
            <h1 className="text-2xl font-bold font-inter tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BAJAJ FINSERV AI
            </h1>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {showBackButton && onBackToHome && (
              <Button
                onClick={onBackToHome}
                variant="outline"
                size="sm"
                className="border border-primary/20 hover:border-accent/50 glass backdrop-blur-sm hover:bg-accent/10 transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};