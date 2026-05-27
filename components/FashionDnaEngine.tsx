import React, { useState, useMemo } from 'react';
import { generateFashionDna, FashionDna, Selections } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const styleChoices: { [key: string]: string[] } = {
  "Color Palette": ["Earthy Tones", "Monochrome", "Vibrant Hues", "Soft Pastels"],
  "Vibe": ["Minimalist & Clean", "Bohemian & Free", "Streetwear Edge", "Elegant & Classic"],
  "Occasion Focus": ["Everyday Comfort", "Work & Formal", "Creative Expression", "Festive & Grand"],
};

const FashionDnaEngine: React.FC = () => {
  const [selections, setSelections] = useState<Selections>({});
  const [dnaResult, setDnaResult] = useState<FashionDna | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = Object.keys(styleChoices);

  const handleSelection = (category: string, value: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const isComplete = useMemo(() => {
    return categories.every(category => selections[category]);
  }, [selections, categories]);

  const handleGenerate = async () => {
    if (!isComplete || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateFashionDna(selections);
      setDnaResult(result);
    } catch (err) {
      setError("Could not generate your Fashion DNA. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelections({});
    setDnaResult(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Analyzing your style..." />;
    }
    
    if (error) {
      return (
        <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button onClick={handleReset} className="mt-4 px-6 py-2 text-sm bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 transition-colors">
                Try Again
            </button>
        </div>
      );
    }

    if (dnaResult) {
      return (
        <div className="w-full max-w-2xl bg-white/50 p-8 rounded-lg shadow-sm text-center space-y-4 animate-fade-in">
          <p className="text-sm tracking-widest text-deep-purple/70">YOUR STYLE ARCHETYPE</p>
          <h3 className="text-3xl font-semibold text-deep-purple">{dnaResult.archetype}</h3>
          <p className="text-deep-purple/80 font-light max-w-lg mx-auto">{dnaResult.description}</p>
          <button onClick={handleReset} className="mt-4 px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 transition-transform duration-200 transform hover:scale-105">
            Discover Again
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl text-left space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-deep-purple mb-3">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {styleChoices[category].map(value => {
                const isSelected = selections[category] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleSelection(category, value)}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200
                      ${isSelected 
                        ? 'bg-brand-mint text-deep-purple font-semibold shadow-md' 
                        : 'bg-white/60 text-deep-purple/80 hover:bg-light-mint'
                      }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="text-center pt-4">
            <button
                onClick={handleGenerate}
                disabled={!isComplete || isLoading}
                className="px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105 disabled:bg-deep-purple/50 disabled:cursor-not-allowed disabled:transform-none"
            >
                Generate My Fashion DNA
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center space-y-8 text-center mt-16 pb-16">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-light">Fashion DNA Engine</h2>
        <p className="text-deep-purple/70 max-w-2xl">
          Build your personal style fingerprint. Make a selection from each category to discover your unique style archetype.
        </p>
      </div>
      <div className="w-full min-h-[10rem] flex items-center justify-center p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default FashionDnaEngine;