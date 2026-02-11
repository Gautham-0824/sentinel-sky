import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroOverlayProps {
  onComplete: () => void;
}

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const letters = 'SENTRIX'.split('');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Scan line effect */}
          <div className="absolute inset-0 scanline pointer-events-none" />

          {/* Horizontal scan beam */}
          {phase >= 1 && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-primary/30"
              initial={{ top: '30%', opacity: 0 }}
              animate={{ top: '70%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, ease: 'linear' }}
            />
          )}

          {/* Main title */}
          <div className="relative">
            {phase >= 1 && (
              <div className="flex items-center gap-1 md:gap-2">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-[0.2em] text-primary text-glow"
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Tagline */}
          {phase >= 2 && (
            <motion.p
              className="mt-6 md:mt-8 text-base md:text-xl tracking-[0.4em] uppercase text-muted-foreground font-light"
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Detect · Deceive · Defend
            </motion.p>
          )}

          {/* System initialization text */}
          {phase >= 3 && (
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 1.2 }}
            >
              <p className="text-xs font-mono text-primary/60 tracking-widest">
                INITIALIZING DEFENSE GRID...
              </p>
            </motion.div>
          )}

          {/* Corner markers */}
          <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-primary/20" />
          <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-primary/20" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-primary/20" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-primary/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
