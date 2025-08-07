import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const MeetRajan = () => {
  const [currentMemory, setCurrentMemory] = useState(0);
  
  const memories = [
    {
      text: "Denied claim for missing clause 5.2 in March 2021",
      type: "denied",
      details: "Pre-existing condition disclosure was incomplete"
    },
    {
      text: "Approved pre-op ACL surgery in April 2022", 
      type: "approved",
      details: "All documentation was complete and within policy terms"
    },
    {
      text: "Flagged suspicious claim pattern in May 2023",
      type: "investigation",
      details: "Multiple similar claims from same provider required review"
    }
  ];

  const nextMemory = () => {
    setCurrentMemory((prev) => (prev + 1) % memories.length);
  };

  const prevMemory = () => {
    setCurrentMemory((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left: RAJAN Image/Avatar */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="glass neumorphism rounded-3xl p-8 text-center">
              {/* Trust image */}
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full overflow-hidden shadow-neumorphism">
                <img 
                  src="/images/trust-handshake.jpg" 
                  alt="Professional handshake representing trust and reliability in Bajaj Finserv" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-2">BAJAJ AI ASSISTANT</h3>
              <p className="text-muted-foreground">Powered by Bajaj Finserv Intelligence</p>
              
              {/* Thinking indicator */}
              <motion.div
                className="mt-4 flex justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm text-accent">● Analyzing patterns...</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Meet Your Bajaj AI Assistant
              </h2>
              
              <div className="glass neumorphism rounded-2xl p-6 mb-6">
                <p className="text-lg text-foreground leading-relaxed">
                  "Namaste! I'm your Bajaj Finserv AI Assistant, trained on thousands of real insurance cases 
                  across India. I understand your unique needs and provide quick, fair decisions with complete 
                  transparency. Trusted by millions of Bajaj customers."
                </p>
                
                <Button
                  onClick={() => speakText("Namaste! I'm your Bajaj Finserv AI Assistant, trained on thousands of real insurance cases across India.")}
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-accent hover:text-accent-foreground hover:bg-accent/10"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen to Your AI Assistant
                </Button>
              </div>
            </div>

            {/* Memory Snippets Carousel */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Memory Snippets
              </h3>
              
              <Card className="glass neumorphism-inset p-6 relative overflow-hidden">
                <motion.div
                  key={currentMemory}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    memories[currentMemory].type === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : memories[currentMemory].type === 'denied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {memories[currentMemory].type.toUpperCase()}
                  </div>
                  
                  <p className="text-lg font-medium text-foreground mb-2">
                    "{memories[currentMemory].text}"
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    {memories[currentMemory].details}
                  </p>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={prevMemory}
                    variant="ghost"
                    size="sm"
                    className="opacity-60 hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex space-x-2">
                    {memories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMemory(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentMemory ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={nextMemory}
                    variant="ghost"
                    size="sm"
                    className="opacity-60 hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Ethics badge */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-gradient-to-r from-accent/10 to-primary/10 px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                🛡️ Trusted by 50+ Million Indians. Bajaj Finserv - Your Financial Partner.
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};