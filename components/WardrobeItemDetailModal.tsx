import React, { useState, useEffect } from 'react';
import { ClothingItemTags } from '../services/geminiService';

interface WardrobeItem {
    id: number;
    file: File;
    previewUrl: string;
    tags: ClothingItemTags | null;
    isLoading: boolean;
    error: string | null;
    notes?: string;
}

interface ModalProps {
    item: WardrobeItem;
    onSave: (updatedItem: WardrobeItem) => void;
    onClose: () => void;
}

const WardrobeItemDetailModal: React.FC<ModalProps> = ({ item, onSave, onClose }) => {
    const [editableTags, setEditableTags] = useState<ClothingItemTags>(item.tags || { itemName: '', season: '', color: '', occasion: '' });
    const [notes, setNotes] = useState<string>(item.notes || '');

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableTags(prev => ({ ...prev, [name]: value }));
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    };

    const handleSave = () => {
        onSave({ ...item, tags: editableTags, notes });
    };

    // Handle Escape key press to close modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-cream rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full md:w-1/2 flex-shrink-0 bg-white/50">
                    <img src={item.previewUrl} alt="Clothing item" className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-semibold text-deep-purple mb-6">Edit Details</h3>
                         <button onClick={onClose} className="text-deep-purple/50 hover:text-deep-purple" aria-label="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-deep-purple/80">Item Name</label>
                            <input
                                type="text"
                                id="itemName"
                                name="itemName"
                                value={editableTags.itemName}
                                onChange={handleTagChange}
                                className="mt-1 block w-full bg-white/80 border-soft-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-mint focus:border-brand-mint"
                            />
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-deep-purple/80">Color</label>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                value={editableTags.color}
                                onChange={handleTagChange}
                                className="mt-1 block w-full bg-white/80 border-soft-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-mint focus:border-brand-mint"
                            />
                        </div>
                        <div>
                            <label htmlFor="season" className="block text-sm font-medium text-deep-purple/80">Season</label>
                            <input
                                type="text"
                                id="season"
                                name="season"
                                value={editableTags.season}
                                onChange={handleTagChange}
                                className="mt-1 block w-full bg-white/80 border-soft-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-mint focus:border-brand-mint"
                            />
                        </div>
                         <div>
                            <label htmlFor="occasion" className="block text-sm font-medium text-deep-purple/80">Occasion</label>
                            <input
                                type="text"
                                id="occasion"
                                name="occasion"
                                value={editableTags.occasion}
                                onChange={handleTagChange}
                                className="mt-1 block w-full bg-white/80 border-soft-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-mint focus:border-brand-mint"
                            />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-deep-purple/80">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={handleNotesChange}
                                rows={4}
                                className="mt-1 block w-full bg-white/80 border-soft-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-mint focus:border-brand-mint"
                                placeholder="e.g., Goes well with black jeans, dry clean only..."
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-white/80 text-deep-purple rounded-md font-semibold hover:bg-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 text-sm bg-deep-purple text-cream rounded-md font-semibold hover:bg-deep-purple/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WardrobeItemDetailModal;
