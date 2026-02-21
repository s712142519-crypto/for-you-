
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHOTOS } from '../constants';
import { PhotoData } from '../types';

interface PhotoCarouselProps {
  onPhotoClick: (photo: PhotoData) => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ onPhotoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 30;
    if (info.offset.x > threshold) {
      setCurrentIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
    } else if (info.offset.x < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % PHOTOS.length);
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden px-2 select-none">
      <div className="relative w-full flex items-center justify-center h-full perspective-1000 z-10">
        <AnimatePresence mode="popLayout">
          {PHOTOS.map((photo, index) => {
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);
            
            // Logic to handle cyclic display
            let normalizedOffset = offset;
            if (offset > PHOTOS.length / 2) normalizedOffset -= PHOTOS.length;
            if (offset < -PHOTOS.length / 2) normalizedOffset += PHOTOS.length;
            
            const displayAbsOffset = Math.abs(normalizedOffset);
            if (displayAbsOffset > 2) return null;

            const xOffset = isMobile ? 110 : 200;
            const x = normalizedOffset * xOffset;
            const z = -displayAbsOffset * (isMobile ? 100 : 150);
            const scale = 1 - displayAbsOffset * 0.15;
            const opacity = 1 - displayAbsOffset * 0.4;

            return (
              <motion.div
                key={photo.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onClick={() => displayAbsOffset === 0 && onPhotoClick(photo)}
                className={`absolute cursor-grab rounded-xl overflow-hidden border-2 shadow-xl ${index % 2 === 0 ? 'border-pink-500' : 'border-purple-500'}`}
                animate={{ x, z, scale, opacity, zIndex: PHOTOS.length - displayAbsOffset }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ 
                  width: isMobile ? '160px' : '220px', 
                  height: isMobile ? '240px' : '320px', 
                  perspective: '1000px' 
                }}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                  <p className="text-white text-[9px] font-romantic truncate text-center">{photo.caption}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="flex gap-1.5 mt-4 max-w-full overflow-hidden py-1 z-10 flex-wrap justify-center px-4">
        {PHOTOS.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-pink-500' : 'w-1 bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
};
