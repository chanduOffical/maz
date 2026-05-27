import React, { useState, useRef } from 'react';
import { createAvatar } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const AvatarStudio: React.FC = () => {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError("Image file is too large. Please select a file smaller than 4MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSourceImage(reader.result as string);
                handleGenerateAvatar(file);
            };
            reader.onerror = () => {
                setError("Failed to read the image file.");
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerateAvatar = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setGeneratedAvatar(null);

        try {
            const base64Image = await blobToBase64(file);
            const base64Data = base64Image.split(',')[1];
            const result = await createAvatar(base64Data, file.type);
            setGeneratedAvatar(result);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message || "An unexpected error occurred while creating the avatar.");
            } else {
                setError("An unexpected error occurred while creating the avatar.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setSourceImage(null);
        setGeneratedAvatar(null);
        setError(null);
        setIsLoading(false);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <LoadingSpinner message="Crafting your digital twin..." />
                    {sourceImage && (
                        <img src={sourceImage} alt="Your photo" className="w-32 h-32 object-cover rounded-lg opacity-50" />
                    )}
                </div>
            );
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

        if (generatedAvatar && sourceImage) {
            return (
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 animate-fade-in">
                    <div className="text-center">
                        <img src={sourceImage} alt="Original photo" className="w-48 h-48 object-cover rounded-lg shadow-md" />
                        <p className="mt-2 text-sm text-deep-purple/70">Original</p>
                    </div>
                    <div className="text-center">
                        <img src={generatedAvatar} alt="Generated 3D Avatar" className="w-48 h-48 object-cover rounded-lg shadow-md" />
                        <p className="mt-2 text-sm text-deep-purple/70">Your Avatar</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center text-deep-purple/50 p-8 flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 max-w-xs">Upload a clear, front-facing photo to create your personalized 3D-style avatar.</p>
            </div>
        );
    };

    const renderControls = () => {
        if (isLoading) return null;

        if (generatedAvatar) {
            return (
                <div className="flex w-full justify-center space-x-4">
                     <a
                        href={generatedAvatar}
                        download="mazzura-avatar.jpg"
                        className="px-6 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 transition-transform duration-200 transform hover:scale-105 text-center"
                    >
                        Download Avatar
                    </a>
                    <button onClick={handleReset} className="px-6 py-3 bg-white/80 text-deep-purple rounded-md font-semibold hover:bg-white transition-colors">
                        Create New
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={triggerFileInput}
                className="px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105"
            >
                Upload Photo
            </button>
        );
    }

    return (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-light">3D AI Avatar Studio</h2>
                <p className="text-deep-purple/70 max-w-2xl">
                    Upload an image once to create your 3D digital twin. Your image is deleted instantly for your privacy.
                </p>
            </div>

            <div className="w-full min-h-[20rem] bg-white/50 rounded-lg shadow-inner flex items-center justify-center p-4">
                {renderContent()}
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/png, image/jpeg" 
            />

            <div className="w-full flex justify-center mt-6">
                {renderControls()}
            </div>
        </div>
    );
};

export default AvatarStudio;
