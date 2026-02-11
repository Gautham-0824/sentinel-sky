import { motion, AnimatePresence } from 'framer-motion';

interface HudOverlayProps {
  visible: boolean;
  attackCount: number;
}

function StatCard({ label, value, delay }: { label: string; value: string | number; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-card/60 backdrop-blur-md border border-border/50 border-glow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
      <div>
        <p className="text-xs text-muted-foreground tracking-wider uppercase">{label}</p>
        <p className="text-sm font-semibold font-mono text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

export function HudOverlay({ visible, attackCount }: HudOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Top-left brand */}
          <motion.div
            className="absolute top-6 left-6 md:top-8 md:left-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-primary text-glow">
              SENTRIX
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground tracking-[0.3em] uppercase mt-1">
              Defense Grid · Active
            </p>
          </motion.div>

          {/* Top-right status */}
          <motion.div
            className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground tracking-wider">ONLINE</span>
          </motion.div>

          {/* Bottom-left stats */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 space-y-2">
            <StatCard label="Live Threats" value={attackCount} delay={0.8} />
            <StatCard label="Countries Protected" value={94} delay={1.0} />
            <StatCard label="Avg Response" value="<2.3s" delay={1.2} />
          </div>

          {/* Bottom-right coordinates */}
          <motion.div
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <p className="text-[10px] font-mono text-muted-foreground">
              ORBITAL VIEW
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              DRAG TO ROTATE · SCROLL TO ZOOM
            </p>
          </motion.div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-primary/15" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-primary/15" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-primary/15" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-primary/15" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
