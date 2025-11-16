
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptControls } from './components/PromptControls';
import { ResultDisplay } from './components/ResultDisplay';
import { editImageWithPrompt } from './services/geminiService';
import { fileToBase64, base64ToFile } from './utils/fileUtils';
import { EditHistoryItem } from './types';

// --- Start of inlined components for History ---

const IconHistory: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

interface HistorySidebarProps {
  history: EditHistoryItem[];
  onReapply: (item: EditHistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onReapply }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <IconHistory className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-slate-200 text-center">Edit History</h2>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-slate-400">
            <p>Your edit history will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onReapply(item)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.editedImage} 
                      alt="Edited thumbnail" 
                      className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-slate-900" 
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-300 truncate group-hover:text-white">
                        {item.prompt}
                      </p>
                      <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to reapply
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- End of inlined components ---

export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<EditHistoryItem[]>([]);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setOriginalImagePreview(URL.createObjectURL(file));
    setEditedImage(null);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64Image, mimeType } = await editImageWithPrompt(originalImage, prompt);
      const editedImageUrl = `data:${mimeType};base64,${base64Image}`;
      setEditedImage(editedImageUrl);

      const originalImageBase64 = await fileToBase64(originalImage);
      const newHistoryItem: EditHistoryItem = {
        id: new Date().toISOString(),
        originalImageBase64,
        originalImageMimeType: originalImage.type,
        prompt,
        editedImage: editedImageUrl,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      console.error(err);
      setError(`Failed to generate image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
  };

  const handleReapply = useCallback((item: EditHistoryItem) => {
    const file = base64ToFile(item.originalImageBase64, 'reapplied-image', item.originalImageMimeType);
    setOriginalImage(file);
    setOriginalImagePreview(`data:${item.originalImageMimeType};base64,${item.originalImageBase64}`);
    setEditedImage(item.editedImage);
    setPrompt(item.prompt);
    setError(null);
    setIsLoading(false);
  }, []);


  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-indigo-900/50 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              imagePreview={originalImagePreview} 
              onClear={handleClear} 
            />
            {originalImagePreview && (
              <PromptControls
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            )}
          </div>
          <div className="lg:col-span-5 h-full">
            <ResultDisplay
              originalImage={originalImagePreview}
              editedImage={editedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className="lg:col-span-3 h-full">
             <HistorySidebar history={history} onReapply={handleReapply} />
          </div>
        </main>
      </div>
    </div>
  );
}
