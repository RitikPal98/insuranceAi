import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, ZoomIn, FileText, Clock, Shield } from "lucide-react";
import { useState } from "react";

export const ExplainerSection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'tamil'>('english');

  const explainerCards = [
    {
      icon: <FileText className="w-8 h-8 text-accent" />,
      title: "What is a Policy Clause?",
      simple: "Rules written in your insurance paper that tell you what is covered and what is not.",
      detailed: "Policy clauses are specific terms and conditions in your insurance contract that define coverage limits, exclusions, waiting periods, and claim procedures. They protect both you and the insurance company by clearly stating what is and isn't covered.",
      example: "Clause 5.2 might say: 'Surgery coverage starts after 12 months of premium payment'"
    },
    {
      icon: <Clock className="w-8 h-8 text-accent" />,
      title: "What does 'Waiting Period' mean?",
      simple: "Time you must wait after buying insurance before you can make certain claims.",
      detailed: "A waiting period is a specific timeframe after purchasing your policy during which certain treatments or conditions are not covered. This prevents people from buying insurance only when they need immediate medical care.",
      example: "If you have a 12-month waiting period for surgery, you cannot claim for surgery costs in your first year."
    },
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: "What does ARJUN actually do?",
      simple: "ARJUN reads your insurance papers and decides if your claim should be approved, just like a smart human officer.",
      detailed: "ARJUN AI analyzes your claim by reading policy documents, checking your medical history, verifying waiting periods, and cross-referencing thousands of similar cases. It explains every decision step-by-step so you understand exactly why a claim was approved or rejected.",
      example: "When you submit a claim, ARJUN checks 15+ different policy rules in seconds and explains its decision in simple language."
    }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Set language based on selection
      if (selectedLanguage === 'hindi') {
        utterance.lang = 'hi-IN';
      } else if (selectedLanguage === 'tamil') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const translations = {
    english: {
      title: "Insurance Made Simple",
      subtitle: "Understanding insurance doesn't have to be complicated. Let us explain the basics.",
      clauseTitle: "What is a Policy Clause?",
      clauseSimple: "Rules written in your insurance paper that tell you what is covered and what is not.",
      waitingTitle: "What does 'Waiting Period' mean?",
      waitingSimple: "Time you must wait after buying insurance before you can make certain claims.",
      arjunTitle: "What does ARJUN actually do?",
      arjunSimple: "ARJUN reads your insurance papers and decides if your claim should be approved, just like a smart human officer."
    },
    hindi: {
      title: "बीमा को सरल बनाया गया",
      subtitle: "बीमे को समझना जटिल नहीं होना चाहिए। आइए हम मूल बातें समझाते हैं।",
      clauseTitle: "पॉलिसी क्लॉज़ क्या है?",
      clauseSimple: "आपके बीमा पेपर में लिखे नियम जो बताते हैं कि क्या कवर है और क्या नहीं।",
      waitingTitle: "'प्रतीक्षा अवधि' का क्या मतलब है?",
      waitingSimple: "बीमा खरीदने के बाद आपको कुछ दावों के लिए जो समय इंतजार करना पड़ता है।",
      arjunTitle: "अर्जुन वास्तव में क्या करता है?",
      arjunSimple: "अर्जुन आपके बीमा कागजात पढ़ता है और तय करता है कि आपका दावा स्वीकार होना चाहिए या नहीं।"
    },
    tamil: {
      title: "காப்பீடு எளிமையாக்கப்பட்டது",
      subtitle: "காப்பீட்டைப் புரிந்துகொள்வது சிக்கலானதாக இருக்க வேண்டியதில்லை। அடிப்படைகளை விளக்குகிறோம்.",
      clauseTitle: "பாலிசி க்ளாஸ் என்றால் என்ன?",
      clauseSimple: "உங்கள் காப்பீட்டு ஆவணத்தில் எழுதப்பட்ட விதிகள் எது கவர் செய்யப்பட்டுள்ளது, எது இல்லை என்று கூறுகின்றன.",
      waitingTitle: "'காத்திருப்பு காலம்' என்றால் என்ன?",
      waitingSimple: "காப்பீடு வாங்கிய பிறகு சில கோரிக்கைகளுக்கு நீங்கள் காத்திருக்க வேண்டிய நேரம்.",
      arjunTitle: "அர்ஜுன் உண்மையில் என்ன செய்கிறார்?",
      arjunSimple: "அர்ஜுன் உங்கள் காப்பீட்டு ஆவணங்களைப் படித்து உங்கள் கோரிக்கை அங்கீகரிக்கப்பட வேண்டுமா என்று முடிவு செய்கிறார்."
    }
  };

  const getTranslatedText = (textKey: keyof typeof translations.english) => {
    return translations[selectedLanguage][textKey] || translations.english[textKey];
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {getTranslatedText('title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {getTranslatedText('subtitle')}
          </p>

          {/* Language Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted/50 rounded-xl p-1 glass backdrop-blur-sm">
              {[
                { key: 'english', label: '🔊 English', flag: '🇺🇸' },
                { key: 'hindi', label: '🇮🇳 Hindi', flag: '🇮🇳' },
                { key: 'tamil', label: '🗣️ Tamil', flag: '🇮🇳' }
              ].map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => setSelectedLanguage(lang.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === lang.key
                      ? 'bg-accent text-accent-foreground shadow-neumorphism'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Explainer Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {explainerCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card 
                className={`glass neumorphism p-6 cursor-pointer transition-all duration-300 hover:shadow-neumorphism-inset ${
                  activeCard === index ? 'border-accent/50 shadow-neumorphism-inset' : ''
                }`}
                onClick={() => setActiveCard(activeCard === index ? null : index)}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {index === 0 ? getTranslatedText('clauseTitle') : 
                     index === 1 ? getTranslatedText('waitingTitle') : 
                     getTranslatedText('arjunTitle')}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="neumorphism-inset p-4 rounded-xl">
                    <p className="text-foreground text-base leading-relaxed">
                      {activeCard === index ? card.detailed : 
                       (index === 0 ? getTranslatedText('clauseSimple') : 
                        index === 1 ? getTranslatedText('waitingSimple') : 
                        getTranslatedText('arjunSimple'))}
                    </p>
                  </div>

                  {activeCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="bg-accent/5 p-3 rounded-xl border border-accent/20">
                        <p className="text-sm font-medium text-foreground mb-1">Example:</p>
                        <p className="text-sm text-muted-foreground italic">
                          {card.example}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(activeCard === index ? card.detailed : card.simple);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent-foreground hover:bg-accent/10"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ZoomIn className="w-4 h-4 mr-2" />
                      {activeCard === index ? 'Less' : 'More'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Video Explainer Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="glass neumorphism p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Watch How ARJUN Works
            </h3>
            <p className="text-muted-foreground mb-6">
              A simple video explanation of how ARJUN AI analyzes insurance claims
            </p>
            
            {/* Video Placeholder */}
            <div className="aspect-video bg-muted/20 rounded-xl neumorphism-inset flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ▶️
                  </motion.div>
                </div>
                <p className="text-muted-foreground">Video Coming Soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Interactive explainer with {selectedLanguage} narration
                </p>
              </div>
            </div>

            {/* Video Features */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Step-by-step process</Badge>
              <Badge variant="secondary">Real examples</Badge>
              <Badge variant="secondary">Multi-language support</Badge>
              <Badge variant="secondary">Easy to understand</Badge>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};