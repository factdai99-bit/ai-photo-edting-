
import React from 'react';
import { IconSparkles } from './Icons';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-4">
       <h2 className="text-xl font-semibold text-slate-200 text-center">Describe Your Edits</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Make the sky a vibrant sunset, add a small boat on the water..."
        className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt.trim()}
        className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <IconSparkles className="w-6 h-6 mr-2" />
            Generate
          </>
        )}
      </button>
    </div>
  );
};
