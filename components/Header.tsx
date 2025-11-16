
import React from 'react';
import { IconPhotoEdit } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <IconPhotoEdit className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          AI Photo Editor
        </h1>
      </div>
      <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto">
        Upload an image, describe your edits, and let AI bring your vision to life.
      </p>
    </header>
  );
};
