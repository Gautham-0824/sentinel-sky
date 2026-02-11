import { motion } from 'framer-motion';
import { Brain, Globe, BarChart3, Shield, Zap, Lock } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  reverse?: boolean;
}

function FeatureSection({ icon, title, subtitle, description, stats, reverse }: FeatureProps) {
  return (
    <section className="min-h-screen flex items-center py-20 px-6 md:px-12 lg:px-20 relative overflow-hidden noise-overlay">
      <div className={`max-w-7xl mx-auto w-full flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
        {/* Visual */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute inset-4 rounded-full border border-primary/10" />
            <div className="absolute inset-8 rounded-full border border-primary/20 animate-flicker" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-full bg-card/80 border border-border border-glow">
                {icon}
              </div>
            </div>
            {/* Orbital dots */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-primary/30" />
            <div className="absolute top-1/4 left-2 w-1 h-1 rounded-full bg-destructive/30" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div>
            <p className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-3">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {title}
            </h2>
          </div>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
            {description}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Divider line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}

export function FeatureSections() {
  return (
    <div className="bg-background relative">
      {/* Transition gradient from globe */}
      <div className="h-32 bg-gradient-to-b from-[#080c18] to-background" />

      <FeatureSection
        icon={<Brain className="w-12 h-12 text-primary" />}
        subtitle="Neural Detection"
        title="AI-Powered Threat Detection"
        description="SentriX deploys advanced neural networks trained on billions of threat signatures. Our AI doesn't just detect known patterns — it anticipates novel attack vectors before they materialize, achieving a 99.7% detection rate with near-zero false positives."
        stats={[
          { label: 'Detection Rate', value: '99.7%' },
          { label: 'Response Time', value: '<2s' },
          { label: 'False Positives', value: '0.01%' },
        ]}
      />

      <FeatureSection
        icon={<Globe className="w-12 h-12 text-primary" />}
        subtitle="Global Coverage"
        title="Real-Time Global Monitoring"
        description="Continuous surveillance across 94+ countries with distributed sensor networks providing 24/7 threat telemetry. Every packet, every anomaly, every micro-deviation is analyzed in real-time through our distributed intelligence mesh."
        stats={[
          { label: 'Countries', value: '94+' },
          { label: 'Sensors', value: '12K' },
          { label: 'Uptime', value: '99.99%' },
        ]}
        reverse
      />

      <FeatureSection
        icon={<BarChart3 className="w-12 h-12 text-primary" />}
        subtitle="Deep Analytics"
        title="Advanced Analytics Dashboard"
        description="Transform raw threat data into actionable intelligence with predictive analytics, attack pattern visualization, and automated threat timeline reconstruction. Our analytics engine processes petabytes of security data to surface critical insights."
        stats={[
          { label: 'Data Points', value: '8B+' },
          { label: 'Predictions', value: '96%' },
          { label: 'Reports', value: '∞' },
        ]}
      />

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <Zap className="w-5 h-5 text-threat-low" />
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Ready to Defend?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the world's most advanced cyber defense network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_hsl(190_100%_50%/0.3)]">
              Request Demo
            </button>
            <button className="px-8 py-3 text-sm font-medium tracking-[0.15em] uppercase rounded-md border border-border text-foreground hover:bg-muted transition-colors">
              Documentation
            </button>
          </div>
        </motion.div>

        {/* Footer brand */}
        <div className="mt-32 space-y-3">
          <p className="text-xs font-mono text-muted-foreground/40 tracking-[0.3em]">SENTRIX DEFENSE SYSTEMS</p>
          <p className="text-xs text-muted-foreground/30">Detect · Deceive · Defend</p>
        </div>
      </section>
    </div>
  );
}
