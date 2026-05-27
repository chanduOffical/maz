import React from 'react';

interface PrivacyByDesignProps {
  isCameraEnabled: boolean;
  onCameraToggle: () => void;
}

const PrivacyByDesign: React.FC<PrivacyByDesignProps> = ({ isCameraEnabled, onCameraToggle }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center space-y-8 text-center my-16">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-light">Privacy by Design</h2>
        <p className="text-deep-purple/70 max-w-3xl">
          You are in complete control of your data. Our ecosystem is built on the principle of privacy-first, ensuring your creative exploration is always secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left pt-4">
        {/* Card 1: Manual Control */}
        <div className="bg-white/50 p-6 rounded-lg shadow-sm space-y-3 flex flex-col">
           <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-light-mint rounded-full flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
             </div>
             <h3 className="text-xl font-semibold text-deep-purple">Your Data, Your Rules</h3>
           </div>
           <p className="text-deep-purple/80 text-sm font-light flex-grow">
             Choose how you interact. You can skip image uploads entirely and still receive hyper-personalized results by manually defining your style preferences through our Fashion DNA Engine. Your vibe, your terms.
           </p>
        </div>

        {/* Card 2: Secure Processing */}
        <div className="bg-white/50 p-6 rounded-lg shadow-sm space-y-3 flex flex-col">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-light-mint rounded-full flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-deep-purple">Encrypted & Ephemeral</h3>
            </div>
            <p className="text-deep-purple/80 text-sm font-light flex-grow">
                All AI processing is encrypted and temporary. For features like AR Try-On and Avatar Studio, your image is used for a single generation and then instantly deleted from our systems. We never store your photos.
            </p>
        </div>

        {/* Card 3: Camera Control */}
        <div className="bg-white/50 p-6 rounded-lg shadow-sm space-y-3 flex flex-col md:col-span-2">
           <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-light-mint rounded-full flex-shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
             </div>
             <h3 className="text-xl font-semibold text-deep-purple">Camera Permissions</h3>
           </div>
           <p className="text-deep-purple/80 text-sm font-light">
             Enable or disable camera access for features like the AR Styling Studio. Your choice is always respected and can be changed at any time.
           </p>
           <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-deep-purple">Allow Camera Access</span>
                <label htmlFor="camera-toggle" className="relative inline-flex items-center cursor-pointer" aria-label="Allow camera access">
                    <input 
                        type="checkbox" 
                        id="camera-toggle" 
                        className="sr-only peer" 
                        checked={isCameraEnabled} 
                        onChange={onCameraToggle} 
                    />
                    <div className="w-11 h-6 bg-soft-gray rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-mint peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mint"></div>
                </label>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyByDesign;