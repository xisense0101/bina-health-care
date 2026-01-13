import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: { url: string; alt: string }[];
  autoPlayInterval?: number;
  showControls?: boolean;
  className?: string;
}

export function ImageCarousel({ 
  images, 
  autoPlayInterval = 5000,
  showControls = true,
  className = ''
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const imageRefs = useRef<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
    });
  }, [images]);

  useEffect(() => {
    if (autoPlayInterval && images.length > 1) {
      const timer = setInterval(() => {
        handleNext();
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [currentIndex, autoPlayInterval, images.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Card stacking effect - slides on top with crossfade (no opacity 0 on enter)
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
      scale: 1,
      zIndex: 2,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 2,
    },
    exit: {
      x: 0,
      opacity: 0,
      scale: 0.98,
      zIndex: 1,
    },
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gray-900 ${className}`}>
      {/* Background image - shows previous image */}
      <div className="absolute inset-0">
        <img
          src={images[(currentIndex - 1 + images.length) % images.length].url}
          alt={images[(currentIndex - 1 + images.length) % images.length].alt}
          className="w-full h-full object-cover"
        />
      </div>
      
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'tween', duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.5 },
            scale: { duration: 0.7 },
          }}
          className="absolute inset-0 will-change-transform"
        >
            <img
              ref={el => imageRefs.current[currentIndex] = el!}
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
        </motion.div>
      </AnimatePresence>

      {showControls && images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
