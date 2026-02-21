
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ConfettiPiece: React.FC<{ index: number; delay: number }> = ({ index, delay }) => {
  const colors = ['#ff007f', '#a855f7', '#facc15', '#3b82f6', '#10b981'];
  const color = colors[index % colors.length];
  const angle = (index / 50) * Math.PI * 2;
  const velocity = 150 + Math.random() * 250;
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0 }}
      animate={{ x: Math.cos(angle) * velocity, y: Math.sin(angle) * velocity - 50, scale: [0, 1, 0], opacity: [1, 1, 0] }}
      transition={{ delay, duration: 2.5, ease: "easeOut" }}
      className="absolute w-1.5 h-3"
      style={{ backgroundColor: color, left: '50%', top: '50%' }}
    />
  );
};

export const FlowerGrowth: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const confettiCount = 100;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-pink-500/10 rounded-full blur-[80px]"
            initial={{ 
              x: Math.random() * 100 + "vw", 
              y: Math.random() * 100 + "vh",
              width: 150,
              height: 150,
            }}
            animate={{ 
              x: [null, Math.random() * 100 + "vw"],
              y: [null, Math.random() * 100 + "vh"],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <p className="font-heading text-[10px] sm:text-[12px] uppercase tracking-[0.5em] text-white/40 mb-4">Especially for you</p>
          <h2 className="font-romantic text-white text-4xl sm:text-7xl drop-shadow-md leading-tight">Happy Birthday</h2>
          <h1 className="font-romantic font-bold text-accent-pink text-6xl sm:text-9xl tracking-tighter drop-shadow-[0_0_40px_rgba(255,0,127,0.5)]">panda</h1>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 2 }}
          onClick={onComplete} 
          className="px-12 sm:px-16 py-4 sm:py-5 rounded-full border border-pink-500/50 text-pink-400 font-heading text-[11px] uppercase tracking-[0.3em] bg-pink-500/10 backdrop-blur-xl active:scale-95 hover:bg-pink-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,0,127,0.2)]"
        >
          OPEN THE GIFT
        </motion.button>
      </div>

      {/* Celebration Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: confettiCount }).map((_, i) => (
          <ConfettiPiece key={i} index={i} delay={0.3} />
        ))}
      </div>
    </div>
  );
};
