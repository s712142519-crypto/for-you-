
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Star, PartyPopper } from 'lucide-react';

interface HeartGameProps {
  onWin: () => void;
}

interface GameItem {
  id: number;
  x: number;
  type: 'heart' | 'gift' | 'star';
  duration: number;
}

export const HeartGame: React.FC<HeartGameProps> = ({ onWin }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<GameItem[]>([]);
  const target = 5; // Reduced target for a faster, easier experience

  useEffect(() => {
    if (score >= target) {
      setTimeout(onWin, 1200);
      return;
    }

    const interval = setInterval(() => {
      const newItem: GameItem = {
        id: Date.now(),
        x: Math.random() * 70 + 15, // Keep away from extreme edges
        type: ['heart', 'gift', 'star'][Math.floor(Math.random() * 3)] as any,
        duration: Math.random() * 2 + 4, // Slower descent (4-6 seconds)
      };
      setItems(prev => [...prev, newItem]);
    }, 1200); // Slower spawn rate

    return () => clearInterval(interval);
  }, [score, onWin]);

  const handleCatch = (id: number) => {
    setScore(s => s + 1);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-pink-900/40 pointer-events-none" />
      
      <div className="relative z-10 mt-20 text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-romantic text-accent-pink mb-4"
        >
          Catch the Love!
        </motion.h2>
        <p className="text-[11px] font-heading text-white/60 uppercase tracking-[0.4em] mb-8">Tap only {target} items to continue</p>
        
        <div className="flex gap-4 justify-center">
          {Array.from({ length: target }).map((_, i) => (
            <motion.div 
              key={i} 
              initial={false}
              animate={{ 
                scale: i < score ? 1.2 : 1,
                backgroundColor: i < score ? '#ff007f' : 'rgba(255,255,255,0.1)'
              }}
              className={`w-4 h-4 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(255,0,127,0.3)]`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ y: -100, x: `${item.x}%`, opacity: 0, scale: 0.5 }}
            animate={{ y: '110vh', opacity: 1, scale: 1.5 }} // Larger scale for easier clicking
            exit={{ scale: 3, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: item.duration, ease: 'linear' }}
            onAnimationComplete={() => setItems(prev => prev.filter(i => i.id !== item.id))}
            onClick={() => handleCatch(item.id)}
            className="absolute cursor-pointer p-6 z-20 active:scale-125 transition-transform"
          >
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20 shadow-2xl">
              {item.type === 'heart' && <Heart className="text-pink-500" fill="currentColor" size={32} />}
              {item.type === 'gift' && <Gift className="text-purple-500" size={32} />}
              {item.type === 'star' && <Star className="text-yellow-500" fill="currentColor" size={32} />}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {score >= target && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <PartyPopper size={100} className="text-pink-500 mb-8" />
            </motion.div>
            <h1 className="text-7xl font-romantic text-white mb-4">Amazing!</h1>
            <p className="text-accent-pink font-heading tracking-[0.5em] text-xs uppercase">Your gift is waiting...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
