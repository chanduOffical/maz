import React, { useState, useEffect, useRef } from 'react';
import { virtualTryOn } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ARTryOnMirrorProps {
  isCameraEnabled: boolean;
}

const ARTryOnMirror: React.FC<ARTryOnMirrorProps> = ({ isCameraEnabled }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const setupCamera = async () => {
      if (!isCameraEnabled) {
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        return;
      }

      if (capturedImage || generatedImage) {
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        return;
      }
      try {
        if (cameraStream) return;
        const localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        stream = localStream;
        setCameraStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access your camera. Please check permissions.");
      }
    };

    setupCamera();
    
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [capturedImage, generatedImage, cameraStream, isCameraEnabled]);

  const handleCapturePose = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setError("Could not get canvas context.");
        return;
    }
    
    context.translate(video.videoWidth, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);

    cameraStream?.getTracks().forEach(track => track.stop());
    setCameraStream(null);
  };

  const handleGenerateStyle = async () => {
    if (!prompt.trim() || isLoading || !capturedImage) {
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        const base64Data = capturedImage.split(',')[1];
        const result = await virtualTryOn(base64Data, 'image/jpeg', prompt);
        setGeneratedImage(result);
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message || "An unexpected error occurred. Please try again.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setCapturedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  };
  
  const renderDisplay = () => {
    if (!isCameraEnabled) {
      return (
          <div className="text-center text-deep-purple/60 p-8 flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="mt-4 font-semibold">Camera Access Disabled</p>
              <p className="mt-2 text-sm">Enable camera access in the privacy settings below.</p>
          </div>
      );
    }
    if (isLoading) return <LoadingSpinner message={'Styling your new look...'} />;
    if (error) return (
        <div className="text-center p-4 flex flex-col items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    );
    if (generatedImage) return <img src={generatedImage} alt="Your styled look" className="w-full h-full object-cover rounded-md animate-fade-in" />;
    if (capturedImage) return <img src={capturedImage} alt="Your captured pose" className="w-full h-full object-cover rounded-md" />;
    
    if (cameraStream) {
      return (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md transform -scale-x-100" />
          <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-sm text-white text-center p-2 rounded-lg text-sm animate-fade-in">
              <p>Ready? Strike a pose and capture your image.</p>
          </div>
        </>
      );
    }

    return (
        <div className="text-center text-deep-purple/50 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mt-4">Initializing camera...</p>
        </div>
    );
  };

  const renderControls = () => {
    if (isLoading || error || !isCameraEnabled) return null;

    if (generatedImage) {
      return (
        <div className="w-full max-w-2xl flex justify-center mt-6">
          <a
            href={generatedImage}
            download="mazzura-style.jpg"
            className="px-6 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 transition-transform duration-200 transform hover:scale-105 text-center"
          >
            Download
          </a>
        </div>
      );
    }
    
    if (capturedImage) {
      return (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-4 mt-6">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe an outfit, e.g., 'a vibrant silk bomber jacket'..."
                className="w-full h-24 resize-none p-3 bg-white/50 border border-soft-gray rounded-md focus:ring-2 focus:ring-brand-mint focus:border-brand-mint transition duration-200 placeholder-deep-purple/50"
            />
            <button
                onClick={handleGenerateStyle}
                disabled={!prompt.trim()}
                className="w-full px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105 disabled:bg-deep-purple/50 disabled:cursor-not-allowed disabled:transform-none"
            >
                Style Me
            </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl flex justify-center mt-6">
        <button
            onClick={handleCapturePose}
            disabled={!cameraStream}
            className="w-full px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105 disabled:bg-deep-purple/50 disabled:cursor-not-allowed"
        >
            Capture Pose
        </button>
      </div>
    );
};

  return (
    <div className="w-full max-w-4xl flex flex-col items-center space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-light">AR Styling Studio</h2>
        <p className="text-deep-purple/70 max-w-2xl">
          See yourself in AI-generated styles. Capture your pose, describe a look, and our AI will style it on you.
        </p>
      </div>

      <div className="w-full max-w-md aspect-[3/4] bg-white/50 rounded-lg shadow-inner flex items-center justify-center p-2 relative overflow-hidden">
        {(capturedImage || generatedImage || error) && (
          <button
            onClick={handleReset}
            className="absolute top-3 right-3 z-10 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
            aria-label="Reset"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        )}
        {renderDisplay()}
      </div>

      {renderControls()}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default ARTryOnMirror;