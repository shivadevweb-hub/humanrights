import React from 'react';

export default function HeaderBanner() {
  return (
    <div className="w-full bg-[#FEFDF5] dark:bg-slate-950 py-6 px-6 border-b border-stone-200 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
      {/* Background Subtle Pattern or Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-100/50 via-transparent to-stone-100/50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-[#7D0000] dark:text-red-500 tracking-tight leading-tight mb-2 uppercase">
            International Human Rights Federation (IHRF)
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg md:text-2xl font-black text-[#000078] dark:text-blue-400 tracking-wider uppercase">
              Justice For All
            </p>
            <p className="text-[10px] md:text-sm font-bold text-stone-600 dark:text-stone-400 tracking-widest uppercase">
              Govt. of India Bk. No. IV-8/2014 • Registered Trust
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#7D0000]/20 to-transparent" />
    </div>
  );
}
