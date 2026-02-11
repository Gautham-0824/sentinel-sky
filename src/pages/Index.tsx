import { useState, useEffect, useCallback, useRef } from 'react';
import { GlobeCanvas } from '@/components/sentrix/GlobeCanvas';
import { IntroOverlay } from '@/components/sentrix/IntroOverlay';
import { IntelligencePanel } from '@/components/sentrix/IntelligencePanel';
import { HudOverlay } from '@/components/sentrix/HudOverlay';
import { FeatureSections } from '@/components/sentrix/FeatureSections';
import { CyberAttack, generateAttack } from '@/data/attackData';

const MAX_ATTACKS = 18;
const SPAWN_INTERVAL_MIN = 1200;
const SPAWN_INTERVAL_MAX = 2800;

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [attacks, setAttacks] = useState<CyberAttack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<CyberAttack | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Spawn initial attacks after intro
  useEffect(() => {
    if (!introComplete) return;

    // Seed initial attacks
    const initial: CyberAttack[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateAttack());
    }
    setAttacks(initial);
  }, [introComplete]);

  // Continuous attack spawning
  useEffect(() => {
    if (!introComplete) return;

    const spawnNext = () => {
      setAttacks((prev) => {
        const newAttack = generateAttack();
        const updated = [...prev, newAttack];
        return updated.length > MAX_ATTACKS ? updated.slice(-MAX_ATTACKS) : updated;
      });

      const delay = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
      spawnTimerRef.current = setTimeout(spawnNext, delay);
    };

    const delay = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
    spawnTimerRef.current = setTimeout(spawnNext, delay);

    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [introComplete]);

  const handleAttackClick = useCallback((attack: CyberAttack) => {
    setSelectedAttack(attack);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedAttack(null);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* Cinematic Intro */}
      <IntroOverlay onComplete={handleIntroComplete} />

      {/* Globe Hero Section */}
      <section className="h-screen w-full relative overflow-hidden">
        <GlobeCanvas
          attacks={attacks}
          onAttackClick={handleAttackClick}
          selectedAttackId={selectedAttack?.id ?? null}
          visible={introComplete}
        />

        {/* HUD Overlay */}
        <HudOverlay visible={introComplete} attackCount={attacks.length} />

        {/* Intelligence Panel */}
        <IntelligencePanel attack={selectedAttack} onClose={handleClosePanel} />
      </section>

      {/* Feature Sections */}
      <FeatureSections />
    </div>
  );
};

export default Index;
