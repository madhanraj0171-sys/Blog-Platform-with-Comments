import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin mb-3" />
      <p className="text-xs text-stone-500 font-medium tracking-wide uppercase">{message}</p>
    </div>
  );
};
