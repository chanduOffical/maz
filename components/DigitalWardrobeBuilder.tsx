import React, { useState, useRef } from 'react';
import { analyzeClothingItem, ClothingItemTags } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import WardrobeItemDetailModal from './WardrobeItemDetailModal';

interface WardrobeItem {
    id: number;
    file: File;
    previewUrl: string;
    tags: ClothingItemTags | null;
    isLoading: boolean;
    error: string | null;
    notes?: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const DigitalWardrobeBuilder: React.FC = () => {
    const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const nextId = useRef(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setGlobalError(null);

        const newItems: WardrobeItem[] = [];

        for (const file of Array.from(files)) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setGlobalError(`'${file.name}' is too large. Please select files smaller than 4MB.`);
                continue;
            }

            const newId = nextId.current++;
            const item: WardrobeItem = {
                id: newId,
                file: file,
                previewUrl: URL.createObjectURL(file),
                tags: null,
                isLoading: true,
                error: null,
                notes: '',
            };
            newItems.push(item);
        }
        
        setWardrobe(prev => [...prev, ...newItems]);

        newItems.forEach(item => {
            analyzeItem(item);
        });
        
        // Reset the file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const analyzeItem = async (item: WardrobeItem) => {
        try {
            const base64Data = await blobToBase64(item.file);
            const tags = await analyzeClothingItem(base64Data, item.file.type);
            setWardrobe(prev => prev.map(w => w.id === item.id ? { ...w, tags, isLoading: false } : w));
        } catch (err) {
            console.error(err);
            setWardrobe(prev => prev.map(w => w.id === item.id ? { ...w, error: 'Tagging failed', isLoading: false } : w));
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleUpdateItem = (updatedItem: WardrobeItem) => {
        setWardrobe(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        setSelectedItem(null);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };


    return (
        <>
            <div className="w-full max-w-4xl flex flex-col items-center space-y-8 text-center mt-16 pb-16">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-light">Digital Wardrobe Builder</h2>
                    <p className="text-deep-purple/70 max-w-2xl">
                        Digitize your closet. Upload photos of your clothes, and our AI will auto-tag them by season, color, and occasion.
                    </p>
                </div>

                <div className="w-full">
                    <button
                        onClick={triggerFileInput}
                        className="px-8 py-3 bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-transform duration-200 transform hover:scale-105"
                    >
                        Upload Clothes
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                        multiple
                    />
                    {globalError && <p className="text-red-500 mt-4 text-sm">{globalError}</p>}
                </div>

                <div className="w-full min-h-[15rem] bg-white/50 rounded-lg shadow-inner p-6">
                    {wardrobe.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-deep-purple/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-4">Your uploaded garments will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {wardrobe.map(item => (
                                <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-lg shadow-md p-3 space-y-3 animate-fade-in text-left cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                                    <div className="aspect-square w-full rounded-md bg-soft-gray overflow-hidden relative flex items-center justify-center">
                                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover"/>
                                        {item.isLoading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-cream border-t-deep-purple rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        {item.error && (
                                             <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center text-center p-2">
                                                <p className="text-xs font-semibold text-white">{item.error}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs space-y-2 text-deep-purple">
                                        {item.tags ? (
                                            <>
                                                <h4 className="font-bold text-sm truncate">{item.tags.itemName}</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="px-1.5 py-0.5 bg-light-mint rounded-full text-[11px] truncate">{item.tags.season}</span>
                                                    <span className="px-1.5 py-0.5 bg-light-mint rounded-full text-[11px] truncate">{item.tags.color}</span>
                                                    <span className="px-1.5 py-0.5 bg-light-mint rounded-full text-[11px] truncate">{item.tags.occasion}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-deep-purple/60 italic">{item.isLoading ? 'Analyzing...' : 'Awaiting tags...'}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {selectedItem && (
                <WardrobeItemDetailModal
                    item={selectedItem}
                    onSave={handleUpdateItem}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default DigitalWardrobeBuilder;