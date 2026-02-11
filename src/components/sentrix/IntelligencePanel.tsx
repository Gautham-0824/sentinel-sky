import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, Radio } from 'lucide-react';
import { CyberAttack, getThreatColor } from '@/data/attackData';

interface Props {
  attack: CyberAttack | null;
  onClose: () => void;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: 'bg-destructive',
    Detected: 'bg-threat-low',
    Mitigated: 'bg-cyber-green',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-muted-foreground'} animate-pulse-glow`} />
  );
}

export function IntelligencePanel({ attack, onClose }: Props) {
  return (
    <AnimatePresence>
      {attack && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-background/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-primary">
                  Threat Intelligence
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Attack ID & Status */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Attack ID</p>
                  <p className="font-mono text-lg text-foreground">{attack.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot status={attack.status} />
                  <span className="text-sm font-medium text-foreground">{attack.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Source / Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Source</p>
                  <p className="text-sm font-semibold text-foreground">{attack.source}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {attack.sourceCoords.lat.toFixed(2)}°, {attack.sourceCoords.lon.toFixed(2)}°
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Target</p>
                  <p className="text-sm font-semibold text-foreground">{attack.target}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {attack.targetCoords.lat.toFixed(2)}°, {attack.targetCoords.lon.toFixed(2)}°
                  </p>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Threat Level */}
              <div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">Threat Level</p>
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: getThreatColor(attack.threatLevel) }}
                  />
                  <span
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: getThreatColor(attack.threatLevel) }}
                  >
                    {attack.threatLevel}
                  </span>
                </div>
              </div>

              {/* Attack Type */}
              <div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">Attack Type</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border">
                  <Radio className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{attack.attackType}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Detected</p>
                <p className="font-mono text-sm text-foreground">{attack.timestamp}</p>
              </div>

              <div className="border-t border-border" />

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2.5 text-sm font-semibold tracking-wider uppercase rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Mitigate Threat
                </button>
                <button className="flex-1 px-4 py-2.5 text-sm font-medium tracking-wider uppercase rounded-md border border-border text-foreground hover:bg-muted transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
