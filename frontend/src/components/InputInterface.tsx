import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Type, Upload, Send, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

interface InputInterfaceProps {
  onSubmit: (query: string, type: 'speak' | 'type' | 'upload') => void;
}

export const InputInterface = ({ onSubmit }: InputInterfaceProps) => {
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exampleQuery = "My mother had heart surgery and policy was rejected after 6 months";

  const startRecording = async () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setRecordedText(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSubmit(`Uploaded document: ${file.name}`, 'upload');
    }
  };

  const speakExample = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(exampleQuery);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-bajaj-blue mb-4">
              Ask Your Bajaj AI Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose your preferred way to communicate with Bajaj Finserv AI
            </p>
          </div>

          <Card className="glass neumorphism p-8 backdrop-blur-xl">
            <Tabs defaultValue="type" className="w-full">
              {/* Tab List */}
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="speak" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  🎤 Speak
                </TabsTrigger>
                <TabsTrigger value="type" className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  💬 Type
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  📄 Upload
                </TabsTrigger>
              </TabsList>

              {/* Speak Tab */}
              <TabsContent value="speak" className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                        : 'bg-bajaj-blue hover:bg-bajaj-dark-blue shadow-neumorphism hover:shadow-neumorphism-inset'
                    }`}
                    onClick={startRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <p className="text-lg font-medium text-foreground mb-2">
                    {isRecording ? "Listening..." : "Tap to speak your problem"}
                  </p>
                  
                  {recordedText && (
                    <div className="glass neumorphism-inset p-4 rounded-xl mb-4">
                      <p className="text-foreground">{recordedText}</p>
                    </div>
                  )}
                  
                  {recordedText && (
                    <Button 
                      onClick={() => onSubmit(recordedText, 'speak')}
                      className="bg-bajaj-blue hover:bg-bajaj-dark-blue text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      🟢 Ask Bajaj AI
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Type Tab */}
              <TabsContent value="type" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Describe your insurance problem
                  </label>
                  
                  <Textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your insurance question or problem here..."
                    className="min-h-[120px] text-lg p-4 glass neumorphism-inset backdrop-blur-sm border-0 focus:ring-2 focus:ring-bajaj-blue"
                  />
                  
                  <div className="mt-4 p-4 bg-bajaj-blue/5 rounded-xl border border-bajaj-blue/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Example:</p>
                        <p className="text-sm text-muted-foreground italic">"{exampleQuery}"</p>
                      </div>
                      <Button
                        onClick={speakExample}
                        variant="ghost"
                        size="sm"
                        className="text-bajaj-blue hover:text-bajaj-blue hover:bg-bajaj-blue/10"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSubmit(textInput, 'type')}
                    disabled={!textInput.trim()}
                    className="w-full mt-6 bg-bajaj-blue hover:bg-bajaj-dark-blue text-white text-lg py-6"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    🟢 Ask Bajaj AI
                  </Button>
                </div>
              </TabsContent>

              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="border-2 border-dashed border-bajaj-blue/30 rounded-xl p-12 glass neumorphism-inset cursor-pointer hover:border-bajaj-blue/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-12 h-12 text-bajaj-blue mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Upload Insurance Document
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Upload PDF, DOCX, or image files for analysis
                    </p>
                    <Button variant="outline" className="border-bajaj-blue/30 text-bajaj-blue hover:bg-bajaj-blue/10">
                      Choose File
                    </Button>
                  </motion.div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, DOCX, DOC, JPG, PNG (max 10MB)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};