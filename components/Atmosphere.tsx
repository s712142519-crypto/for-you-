
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Fixed: Using React.FC to handle React-specific props like 'key' during mapping
const SnowParticle: React.FC<{ index: number }> = ({ index }) => {
  const size = useMemo(() => Math.random() * 4 + 2, []);
  const initialX = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => Math.random() * 10 + 10, []);
  const delay = useMemo(() => Math.random() * 20, []);

  return (
    <motion.div
      initial={{ y: -20, x: `${initialX}vw`, opacity: 0 }}
      animate={{ 
        y: '110vh',
        x: [`${initialX}vw`, `${initialX + (Math.random() * 10 - 5)}vw`, `${initialX}vw`],
        opacity: [0, 0.8, 0.8, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
      className="fixed pointer-events-none rounded-full bg-white blur-[1px] z-[1]"
      style={{ width: size, height: size }}
    />
  );
};

// Fixed: Using React.FC to handle React-specific props like 'key' during mapping
const SakuraPetal: React.FC<{ index: number }> = ({ index }) => {
  const initialX = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => Math.random() * 15 + 15, []);
  const delay = useMemo(() => Math.random() * 25, []);
  const size = useMemo(() => Math.random() * 10 + 5, []);

  return (
    <motion.div
      initial={{ y: -50, x: `${initialX}vw`, opacity: 0, rotate: 0 }}
      animate={{ 
        y: '110vh',
        x: [`${initialX}vw`, `${initialX + 15}vw`, `${initialX - 5}vw`, `${initialX + 10}vw`],
        rotate: [0, 360, 720, 1080],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="fixed pointer-events-none z-[2]"
      style={{ 
        width: size, 
        height: size * 0.7, 
        backgroundColor: '#ffd1dc', 
        borderRadius: '80% 10% 80% 10%',
        boxShadow: '0 0 10px rgba(255, 182, 193, 0.5)'
      }}
    />
  );
};

export const Atmosphere: React.FC = () => {
  const snowParticles = useMemo(() => Array.from({ length: 40 }), []);
  const petals = useMemo(() => Array.from({ length: 25 }), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[5]">
      {snowParticles.map((_, i) => (
        <SnowParticle key={`snow-${i}`} index={i} />
      ))}
      {petals.map((_, i) => (
        <SakuraPetal key={`petal-${i}`} index={i} />
      ))}
    </div>
  );
};
