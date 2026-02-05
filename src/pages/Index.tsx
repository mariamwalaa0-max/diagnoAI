import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { BloodCellAnimation } from '@/components/BloodCellAnimation';
import { FeatureCard } from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Microscope, 
  Sparkles, 
  BarChart3, 
  FlaskConical,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning models identify clinically relevant CBC patterns with high accuracy.',
    variant: 'default' as const,
  },
  {
    icon: BarChart3,
    title: 'Probabilistic Predictions',
    description: 'Get the top 3 most probable conditions with confidence percentages and clear explanations.',
    variant: 'accent' as const,
  },
  {
    icon: FlaskConical,
    title: 'Test Recommendations',
    description: 'Rule-based engine suggests appropriate confirmatory laboratory tests for each prediction.',
    variant: 'default' as const,
  },
  {
    icon: Sparkles,
    title: 'Explainable AI',
    description: 'Transparent reasoning showing which CBC features influenced each prediction.',
    variant: 'accent' as const,
  },
  {
    icon: Shield,
    title: 'Clinical Safety',
    description: 'Designed as decision-support only, emphasizing physician judgment and ethical AI use.',
    variant: 'default' as const,
  },
  {
    icon: Microscope,
    title: 'Research Ready',
    description: 'Suitable for researchers exploring CBC patterns and predictive diagnostics.',
    variant: 'accent' as const,
  },
];

const benefits = [
  'Analyze complete CBC panels in seconds',
  'Evidence-based probabilistic predictions',
  'Clear medical reasoning for each result',
  'Recommended confirmatory laboratory tests',
  'HIPAA-compliant and secure platform',
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container-medical relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16 lg:py-0">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Medical Insights
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                AI-Assisted CBC Interpretation for{' '}
                <span className="gradient-text">Smarter Clinical Insights</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Probabilistic, explainable AI that analyzes Complete Blood Count results 
                and predicts the most probable medical conditions with recommended 
                confirmatory tests.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild variant="hero" size="xl">
                  <Link to="/analyze">
                    Analyze CBC
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl">
                  <Link to="/how-it-works">
                    How It Works
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Trusted by healthcare professionals</p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {benefits.slice(0, 3).map((benefit, i) => (
                    <span key={i} className="flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <BloodCellAnimation className="scale-90 md:scale-100" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent CBC Analysis Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Combining advanced machine learning with rule-based medical logic 
              to provide clinically meaningful insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                variant={feature.variant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="medical-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Analyze Your CBC Results?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Enter your Complete Blood Count parameters and receive AI-powered 
              insights in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/analyze">
                  Start Analysis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="subtle" size="lg">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-6 bg-warning/10 border-y border-warning/20">
        <div className="container-medical">
          <p className="text-center text-sm text-warning font-medium">
            ⚠️ This system is intended for clinical decision support only and must not be used as a standalone diagnostic tool.
          </p>
        </div>
      </section>
    </Layout>
  );
}
