import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Eye, FileText, Clock, Brain, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimulationPageProps {
  query: string;
  onNewQuery: () => void;
}

interface ThinkingStep {
  step: string;
  status: 'processing' | 'complete';
  details?: string;
}

interface ApiClause {
  id: string;
  title: string;
  summary: string;
  relevance?: string;
}

interface ApiResponse {
  decision: 'approved' | 'rejected' | 'under_review';
  status_emoji: string;
  amount?: number;
  confidence: number;
  justification: string;
  query_analysis: {
    age?: number;
    gender?: string;
    medical_terms?: string[];
    location?: string;
    policy_duration?: string;
  };
  clauses: ApiClause[];
  thinking_steps: ThinkingStep[];
  raw_context: Array<{
    source: string;
    content: string;
  }>;
}

export const SimulationPage = ({ query, onNewQuery }: SimulationPageProps) => {
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([
    { step: "Initializing AI analysis...", status: 'processing' },
    { step: "Connecting to document database...", status: 'processing' },
    { step: "Processing your query...", status: 'processing' },
    { step: "Searching relevant policy documents...", status: 'processing' },
    { step: "Analyzing policy terms and conditions...", status: 'processing' },
    { step: "Generating decision...", status: 'processing' },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API call function
  const callBackendAPI = async (userQuery: string): Promise<ApiResponse> => {
    // http://localhost:5000/query
    const response = await fetch('https://insuranceai-backend-4267.onrender.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let apiCallMade = false;

    const processQuery = async () => {
      try {
        // Start the thinking animation
        timer = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev < thinkingSteps.length - 1) {
              setThinkingSteps(steps => 
                steps.map((step, index) => 
                  index === prev ? { ...step, status: 'complete' } : step
                )
              );
              return prev + 1;
            } else {
              setThinkingSteps(steps => 
                steps.map((step, index) => 
                  index === prev ? { ...step, status: 'complete' } : step
                )
              );
              return prev;
            }
          });
        }, 800);

        // Make API call after a short delay
        setTimeout(async () => {
          if (!apiCallMade) {
            apiCallMade = true;
            try {
              const response = await callBackendAPI(query);
              setApiResponse(response);
              
              // Update thinking steps with real data if available
              if (response.thinking_steps && response.thinking_steps.length > 0) {
                setThinkingSteps(response.thinking_steps);
              }
              
              setIsLoading(false);
              setTimeout(() => setShowResult(true), 1000);
            } catch (err) {
              console.error('API Error:', err);
              setError(err instanceof Error ? err.message : 'Failed to process query');
              setIsLoading(false);
              setTimeout(() => setShowResult(true), 1000);
            }
          }
        }, 2000);

      } catch (err) {
        console.error('Process Error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    processQuery();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [query]);

  const clauses = [
    "Clause 5.2: Waiting Period Requirements",
    "Clause 3.1: Pre-existing Condition Disclosure", 
    "Clause 7.4: Coverage Scope and Limitations",
    "Clause 2.8: Premium Payment History",
    "Clause 9.1: Claim Documentation Requirements"
  ];

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Panel: Query Display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass neumorphism p-6 h-fit sticky top-8">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Your Query
              </h3>
              <div className="neumorphism-inset p-4 rounded-xl">
                <p className="text-foreground text-lg leading-relaxed">{query}</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Query Classification:</h4>
                <div className="flex flex-wrap gap-2">
                  {apiResponse?.query_analysis ? (
                    <>
                      {apiResponse.query_analysis.age && (
                        <Badge variant="secondary">Age: {apiResponse.query_analysis.age}</Badge>
                      )}
                      {apiResponse.query_analysis.gender && (
                        <Badge variant="secondary">{apiResponse.query_analysis.gender}</Badge>
                      )}
                      {apiResponse.query_analysis.location && (
                        <Badge variant="secondary">{apiResponse.query_analysis.location}</Badge>
                      )}
                      {apiResponse.query_analysis.policy_duration && (
                        <Badge variant="secondary">{apiResponse.query_analysis.policy_duration}</Badge>
                      )}
                      {apiResponse.query_analysis.medical_terms && apiResponse.query_analysis.medical_terms.length > 0 && (
                        apiResponse.query_analysis.medical_terms.map(term => (
                          <Badge key={term} variant="secondary">{term}</Badge>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Medical Coverage</Badge>
                      <Badge variant="secondary">Policy Analysis</Badge>
                      <Badge variant="secondary">Processing...</Badge>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Panel: RAJAN AI Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* BAJAJ AI Header */}
            <Card className="glass neumorphism p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-bajaj-blue to-bajaj-dark-blue rounded-full flex items-center justify-center mr-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-bajaj-blue">Bajaj AI Assistant</h3>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? "Analyzing your case..." : 
                       error ? "Analysis failed" : 
                       showResult ? "Analysis complete" : "Processing..."}
                    </p>
                  </div>
                </div>
                {isLoading && !showResult && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-bajaj-blue border-t-transparent rounded-full"
                  />
                )}
                {showResult && !error && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                {error && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </Card>

            {/* Document Scanner Animation */}
            <Card className="glass neumorphism p-6">
              <h4 className="text-lg font-semibold text-bajaj-blue mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-bajaj-blue" />
                Document Scanner
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {apiResponse?.raw_context ? (
                    apiResponse.raw_context.map((context, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.3 }}
                        className="text-sm text-muted-foreground bg-muted/20 p-2 rounded"
                      >
                        <span className="font-medium text-bajaj-blue">{context.source}:</span> {context.content}
                      </motion.div>
                    ))
                  ) : (
                    clauses.map((clause, index) => (
                      <motion.div
                        key={clause}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.5 }}
                        className="text-sm text-muted-foreground bg-muted/20 p-2 rounded"
                      >
                        {clause}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Thinking Process */}
            <Card className="glass neumorphism p-6">
              <h4 className="text-lg font-semibold text-bajaj-blue mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-bajaj-blue" />
                Bajaj AI's Thinking Process
              </h4>
              <div className="space-y-3">
                {thinkingSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="flex items-center"
                  >
                    {step.status === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                    ) : (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-5 mr-3 border-2 border-accent border-t-transparent rounded-full animate-spin"
                      />
                    )}
                    <span className={`text-sm ${step.status === 'complete' ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Decision Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {error ? (
                    <Card className="glass neumorphism p-6 border-2 border-red-500/50 bg-red-50/50">
                      <div className="text-center mb-6">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2 text-red-600">Error</h3>
                        <p className="text-lg text-foreground mb-4">{error}</p>
                      </div>
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please make sure the backend server is running on http://localhost:5000
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={onNewQuery}
                        className="w-full bg-bajaj-blue hover:bg-bajaj-dark-blue text-white"
                      >
                        Try Again
                      </Button>
                    </Card>
                  ) : apiResponse ? (
                    <Card className={`glass neumorphism p-6 border-2 ${
                      apiResponse.decision === 'approved' 
                        ? 'border-green-500/50 bg-green-50/50' 
                        : apiResponse.decision === 'rejected'
                        ? 'border-red-500/50 bg-red-50/50'
                        : 'border-yellow-500/50 bg-yellow-50/50'
                    }`}>
                      <div className="text-center mb-6">
                        {apiResponse.decision === 'approved' ? (
                          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        ) : apiResponse.decision === 'rejected' ? (
                          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        ) : (
                          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        )}
                        
                        <h3 className="text-2xl font-bold mb-2">
                          {apiResponse.status_emoji} {apiResponse.decision.toUpperCase()}
                        </h3>
                        
                        {apiResponse.amount && (
                          <p className="text-xl font-semibold text-bajaj-blue mb-2">
                            Amount: ₹{apiResponse.amount.toLocaleString()}
                          </p>
                        )}
                        
                        <p className="text-lg text-foreground mb-4">{apiResponse.justification}</p>
                        
                        <div className="flex justify-center items-center gap-2 mb-4">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <Badge variant="secondary">{apiResponse.confidence}%</Badge>
                        </div>
                      </div>

                      {/* Referenced Clauses */}
                      {apiResponse.clauses && apiResponse.clauses.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h4 className="font-semibold text-bajaj-blue">Referenced Policy Clauses:</h4>
                          {apiResponse.clauses.map((clause) => (
                            <div key={clause.id} className="neumorphism-inset p-3 rounded-xl">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium text-foreground">{clause.title}</span>
                                  <p className="text-sm text-muted-foreground">{clause.summary}</p>
                                  {clause.relevance && (
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      {clause.relevance} relevance
                                    </Badge>
                                  )}
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={() => setShowExplanation(true)}
                          className="flex-1 bg-bajaj-blue hover:bg-bajaj-dark-blue text-white"
                        >
                          🧾 View Full Explanation
                        </Button>
                        <Button 
                          onClick={onNewQuery}
                          variant="outline"
                          className="flex-1 border-bajaj-blue text-bajaj-blue hover:bg-bajaj-blue/10"
                        >
                          Try Another Case
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="glass neumorphism p-6">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-bajaj-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Processing your request...</p>
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Full Explanation Modal */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowExplanation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass neumorphism rounded-3xl p-8 max-w-4xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-bajaj-blue mb-6">
                  Bajaj AI's Complete Analysis
                </h2>
                
                <div className="space-y-6">
                  {apiResponse?.thinking_steps && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Analysis Steps:</h3>
                      <div className="space-y-3">
                        {apiResponse.thinking_steps.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <span className="font-medium text-bajaj-blue mr-2">{index + 1}.</span>
                            <div>
                              <p className="text-foreground">{step.step}</p>
                              {step.details && (
                                <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">AI Justification:</h3>
                    <p className="text-foreground leading-relaxed">
                      {apiResponse?.justification || "Analysis complete. The AI has processed your query using advanced natural language processing and document retrieval to provide this decision."}
                    </p>
                  </div>

                  {apiResponse?.query_analysis && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Query Analysis:</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {apiResponse.query_analysis.age && (
                            <div>
                              <span className="text-sm text-muted-foreground">Age:</span>
                              <p className="font-medium">{apiResponse.query_analysis.age} years</p>
                            </div>
                          )}
                          {apiResponse.query_analysis.gender && (
                            <div>
                              <span className="text-sm text-muted-foreground">Gender:</span>
                              <p className="font-medium capitalize">{apiResponse.query_analysis.gender}</p>
                            </div>
                          )}
                          {apiResponse.query_analysis.location && (
                            <div>
                              <span className="text-sm text-muted-foreground">Location:</span>
                              <p className="font-medium">{apiResponse.query_analysis.location}</p>
                            </div>
                          )}
                          {apiResponse.query_analysis.policy_duration && (
                            <div>
                              <span className="text-sm text-muted-foreground">Policy Duration:</span>
                              <p className="font-medium">{apiResponse.query_analysis.policy_duration}</p>
                            </div>
                          )}
                        </div>
                        {apiResponse.query_analysis.medical_terms && apiResponse.query_analysis.medical_terms.length > 0 && (
                          <div className="mt-4">
                            <span className="text-sm text-muted-foreground">Medical Terms Identified:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {apiResponse.query_analysis.medical_terms.map(term => (
                                <Badge key={term} variant="outline">{term}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <Button 
                  onClick={() => setShowExplanation(false)}
                  className="mt-6 w-full bg-bajaj-blue hover:bg-bajaj-dark-blue text-white"
                >
                  Close Explanation
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};