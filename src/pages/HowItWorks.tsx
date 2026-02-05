import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileInput, 
  Brain, 
  BarChart3, 
  FlaskConical,
  ArrowRight,
  Sparkles,
  Shield,
  Eye
} from 'lucide-react';

const steps = [
  {
    icon: FileInput,
    title: 'CBC Input',
    description: 'Enter your Complete Blood Count parameters from laboratory results.',
  },
  {
    icon: Brain,
    title: 'ML Pattern Recognition',
    description: 'Advanced algorithms analyze CBC patterns against known clinical signatures.',
  },
  {
    icon: BarChart3,
    title: 'Probabilistic Prediction',
    description: 'Top 3 most probable conditions identified with confidence percentages.',
  },
  {
    icon: FlaskConical,
    title: 'Test Recommendations',
    description: 'Rule-based engine suggests confirmatory laboratory tests for each condition.',
  },
];

const principles = [
  {
    icon: Sparkles,
    title: 'Explainable AI',
    description: 'Every prediction comes with clear reasoning showing which CBC features influenced the result. No black-box decisions.',
  },
  {
    icon: Eye,
    title: 'Transparent Probabilities',
    description: 'We provide confidence percentages, not absolute diagnoses. Healthcare professionals can weigh AI insights against their clinical judgment.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Designed as decision-support, not decision-making. The system includes prominent disclaimers and encourages professional verification.',
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              How <span className="gradient-text">CBCAI</span> Works
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform combines machine learning with rule-based medical logic to 
              provide transparent, explainable insights from Complete Blood Count results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              The Analysis Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From input to actionable insights in four seamless steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Principles */}
      <section className="section-padding bg-muted/30">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Our AI Principles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on foundations of transparency, safety, and clinical responsibility.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="medical-card p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent mx-auto mb-6 flex items-center justify-center">
                  <principle.icon className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="section-padding">
        <div className="container-medical max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="medical-card p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Technical Overview</h2>
            
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Machine Learning Model</h3>
                <p className="text-sm leading-relaxed">
                  Our ML pipeline analyzes 14+ CBC parameters to identify patterns associated with 
                  various hematological conditions. The model is trained on extensive clinical datasets 
                  and validated against expert diagnoses.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Rule-Based Engine</h3>
                <p className="text-sm leading-relaxed">
                  A knowledge-driven system maps predicted conditions to appropriate confirmatory 
                  laboratory tests based on established clinical guidelines and medical literature.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Explainability Layer</h3>
                <p className="text-sm leading-relaxed">
                  Feature importance analysis highlights which CBC parameters contributed most to 
                  each prediction, enabling healthcare professionals to understand and verify the 
                  AI's reasoning process.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30">
        <div className="container-medical text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Try It?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Experience AI-powered CBC analysis for yourself. Enter your values 
              and see the results in action.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/analyze">
                Start Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
