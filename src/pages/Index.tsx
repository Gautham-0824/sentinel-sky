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

  /* -------------------------------
     INITIAL ATTACK SEEDING
  --------------------------------*/
  useEffect(() => {
    if (!introComplete) return;

    const initial: CyberAttack[] = [];
    for (let i = 0; i < 8; i++) {
      initial.push(generateAttack());
    }
    setAttacks(initial);
  }, [introComplete]);

  /* -------------------------------
     CONTINUOUS NORMAL ATTACK SPAWN
  --------------------------------*/
  useEffect(() => {
    if (!introComplete) return;

    const spawnNext = () => {
      setAttacks((prev) => {
        const newAttack = generateAttack();
        const updated = [...prev, newAttack];
        return updated.length > MAX_ATTACKS
          ? updated.slice(-MAX_ATTACKS)
          : updated;
      });

      const delay =
        SPAWN_INTERVAL_MIN +
        Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

      spawnTimerRef.current = setTimeout(spawnNext, delay);
    };

    const delay =
      SPAWN_INTERVAL_MIN +
      Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

    spawnTimerRef.current = setTimeout(spawnNext, delay);

    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [introComplete]);

  /* -------------------------------
     AI ANOMALY DETECTION INTEGRATION
     (Isolation Forest Backend)
  --------------------------------*/
  useEffect(() => {
    if (!introComplete) return;

    const checkForAnomaly = async () => {
      try {
        // Fake suspicious feature vector for demo
        const suspiciousFeatures = new Array(78).fill(100000);

        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ features: suspiciousFeatures })
        });

        const data = await res.json();

        if (data.status === "ANOMALY") {
          const anomalyAttack = generateAttack();

          setAttacks(prev => {
            const updated = [...prev, anomalyAttack];
            return updated.length > MAX_ATTACKS
              ? updated.slice(-MAX_ATTACKS)
              : updated;
          });

          // Auto-open Intelligence Panel
          setSelectedAttack(anomalyAttack);

          console.log("🚨 AI DETECTED ANOMALY | Score:", data.score);
        }
      } catch (err) {
        console.error("Anomaly detection failed:", err);
      }
    };

    // Check every 10 seconds (clean demo timing)
    const interval = setInterval(checkForAnomaly, 10000);

    return () => clearInterval(interval);

  }, [introComplete]);

  /* -------------------------------
     HANDLERS
  --------------------------------*/
  const handleAttackClick = useCallback((attack: CyberAttack) => {
    setSelectedAttack(attack);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedAttack(null);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /* -------------------------------
     UI RENDER
  --------------------------------*/
  return (
    <div className="bg-background text-foreground">
      {/* Cinematic Intro */}
      <IntroOverlay onComplete={handleIntroComplete} />

      {/* Globe Section */}
      <section className="h-screen w-full relative overflow-hidden">
        <GlobeCanvas
          attacks={attacks}
          onAttackClick={handleAttackClick}
          selectedAttackId={selectedAttack?.id ?? null}
          visible={introComplete}
        />

        {/* HUD Overlay */}
        <HudOverlay
          visible={introComplete}
          attackCount={attacks.length}
        />

        {/* Intelligence Panel */}
        <IntelligencePanel
          attack={selectedAttack}
          onClose={handleClosePanel}
        />
      </section>

      {/* Feature Sections */}
      <FeatureSections />
    </div>
  );
};

export default Index;
