import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl 
            ${icon ? 'pl-12' : 'px-6'} py-4 text-white placeholder:text-zinc-600
            focus:outline-none focus:border-indigo-600 focus:bg-zinc-900 
            transition-all duration-300
            ${error ? 'border-rose-500/50 focus:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">
          {error}
        </p>
      )}
    </div>
  );
};
