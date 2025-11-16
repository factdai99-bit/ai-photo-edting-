
import React, { useRef, useCallback } from 'react';
import { IconUpload, IconX } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreview, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (imagePreview) {
    return (
      <div className="relative group bg-slate-800 rounded-xl p-4 border border-slate-700">
         <h2 className="text-xl font-semibold text-slate-200 mb-4 text-center">Your Photo</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <img src={imagePreview} alt="Original preview" className="w-full h-full object-contain" />
        </div>
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-2 bg-slate-900/50 text-white rounded-full hover:bg-red-500/80 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Clear image"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h2 className="text-xl font-semibold text-slate-200 mb-4 text-center">Upload an Image</h2>
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <IconUpload className="w-10 h-10 mb-3 text-slate-400" />
          <p className="mb-2 text-sm text-slate-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};
