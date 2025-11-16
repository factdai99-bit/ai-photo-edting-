
import React from 'react';
import { IconDownload } from './Icons';
import { Loader } from './Loader';

interface ResultDisplayProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const ImageCard: React.FC<{ src: string | null; title: string; children?: React.ReactNode }> = ({ src, title, children }) => (
  <div className="flex-1 flex flex-col items-center">
    <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
    <div className="w-full aspect-w-16 aspect-h-9 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
      {src ? <img src={src} alt={title} className="w-full h-full object-contain" /> : <div className="text-slate-500">No image</div>}
    </div>
    {children}
  </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, editedImage, isLoading, error }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-slate-200 mb-4 text-center">Result</h2>
      <div className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : !originalImage ? (
           <div className="text-center text-slate-400">
            <p className="text-lg font-medium">Your edited photo will appear here.</p>
            <p>Start by uploading an image to begin.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-4">
            {editedImage ? (
                <>
                <ImageCard src={originalImage} title="Original" />
                <ImageCard src={editedImage} title="Edited">
                     <a
                        href={editedImage}
                        download="edited-image.png"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors"
                      >
                        <IconDownload className="w-5 h-5 mr-2" />
                        Download
                      </a>
                </ImageCard>
                </>
            ) : (
                <div className="w-full text-center text-slate-400">
                    <p className="text-lg font-medium">Enter a prompt to start editing your photo.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
