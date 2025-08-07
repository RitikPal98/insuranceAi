import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle, Brain } from "lucide-react";

interface HeroProps {
  onTryAI: () => void;
  onWatchDemo: () => void;
}

export const Hero = ({ onTryAI, onWatchDemo }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#2A398D' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A398D] via-[#1E2A6B] to-[#162049]">
        <div className="absolute inset-0 opacity-30">
          {/* Floating elements for background animation */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* White Glass Card Container */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Brain className="w-12 h-12 text-[#2A398D] mr-4 animate-glow" />
            <h1 className="text-4xl md:text-5xl font-bold font-inter tracking-tight bg-gradient-to-r from-[#2A398D] to-[#0066CC] bg-clip-text text-transparent">
              BAJAJ FINSERV AI
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-[#2A398D] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Intelligent Claims Processing for Every Customer
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Powered by Bajaj Finserv's advanced AI technology - Fast, Fair, and Transparent insurance decisions you can trust.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={onTryAI}
              size="lg"
              className="bg-[#2A398D] hover:bg-[#1E2A6B] text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float"
            >
              🟩 Try Bajaj AI Assistant
            </Button>
            
            <Button
              onClick={onWatchDemo}
              variant="outline"
              size="lg"
              className="border-2 border-[#2A398D]/30 hover:border-[#2A398D] text-[#2A398D] hover:bg-[#2A398D]/10 px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              📹 Watch How It Works
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            className="mt-8 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="bg-[#2A398D]/5 px-4 py-2 rounded-full border border-[#2A398D]/20 text-[#2A398D]">
              🛡️ Trusted by 50+ Million Bajaj Finserv Customers
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};