import { useState } from "react";
import { Hero } from "@/components/Hero";
import { MeetRajan } from "@/components/MeetRajan";
import { InputInterface } from "@/components/InputInterface";
import { SimulationPage } from "@/components/SimulationPage";
import { ExplainerSection } from "@/components/ExplainerSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type AppState = 'home' | 'input' | 'simulation' | 'explainer';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentQuery, setCurrentQuery] = useState<string>("");

  const handleTryAI = () => {
    setCurrentState('input');
  };

  const handleWatchDemo = () => {
    setCurrentState('explainer');
  };

  const handleSubmitQuery = (query: string, type: 'speak' | 'type' | 'upload') => {
    setCurrentQuery(query);
    setCurrentState('simulation');
  };

  const handleNewQuery = () => {
    setCurrentQuery("");
    setCurrentState('input');
  };

  const scrollToSection = (section: AppState) => {
    setCurrentState(section);
  };

  const handleBackToHome = () => {
    setCurrentState('home');
  };

  return (
    <div className="min-h-screen">
      {currentState !== 'home' && (
        <Header onBackToHome={handleBackToHome} showBackButton={true} />
      )}
      
      {currentState === 'home' && (
        <>
          <Hero onTryAI={handleTryAI} onWatchDemo={handleWatchDemo} />
          <MeetRajan />
          <ExplainerSection />
        </>
      )}
      
      {currentState === 'input' && (
        <div className="pt-20">
          <InputInterface onSubmit={handleSubmitQuery} />
        </div>
      )}
      
      {currentState === 'simulation' && (
        <div className="pt-20">
          <SimulationPage query={currentQuery} onNewQuery={handleNewQuery} />
        </div>
      )}
      
      {currentState === 'explainer' && (
        <div className="pt-20">
          <ExplainerSection />
        </div>
      )}
      
      <Footer onTryAgain={handleNewQuery} />
    </div>
  );
};

export default Index;
