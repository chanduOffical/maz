import React, { useState } from 'react';
import { styleByMood } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const moods = [
    "Chill & Relaxed",
    "Confident & Bold",
    "Creative & Expressive",
    "Elegant & Calm"
];

const EmotionStyling: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleMoodSelect = async (mood: string) => {
        if (isLoading) return;
        
        setSelectedMood(mood);
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            const imageUrl = await styleByMood(mood);
            setGeneratedImageUrl(imageUrl);
        } catch (err) {
            setError('Failed to style your mood. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-light">Emotion-Based Styling</h2>
                <p className="text-deep-purple/70 max-w-2xl">
                    Select your current mood, and let our AI translate that energy into a look.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {moods.map((mood) => {
                    const isSelected = selectedMood === mood;
                    return (
                        <button
                            key={mood}
                            onClick={() => handleMoodSelect(mood)}
                            disabled={isLoading}
                            className={`px-5 py-2 text-sm rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                ${isSelected && !generatedImageUrl && !error
                                    ? 'bg-brand-mint text-deep-purple font-semibold shadow-md animate-pulse'
                                    : 'bg-white/60 text-deep-purple/80 hover:bg-light-mint'
                                }`}
                        >
                            {mood}
                        </button>
                    )
                })}
            </div>

            <div className="w-full max-w-md aspect-square bg-white/50 rounded-lg shadow-inner flex items-center justify-center p-4">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {generatedImageUrl && !isLoading && (
                    <img
                        src={generatedImageUrl}
                        alt={`AI-generated outfit for the mood: ${selectedMood}`}
                        className="w-full h-full object-cover rounded-md animate-fade-in"
                    />
                )}
                {!isLoading && !error && !generatedImageUrl && (
                    <div className="text-center text-deep-purple/50 p-8">
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4">Your mood-styled outfit will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmotionStyling;