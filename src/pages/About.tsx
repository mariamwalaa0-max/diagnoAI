import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
  Scale, 
  Users, 
  Lock,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ethicalPrinciples = [
  {
    icon: Shield,
    title: 'Clinical Safety First',
    description: 'All AI predictions are presented as probabilistic insights, not definitive diagnoses. We emphasize that human clinical judgment must always guide final decisions.',
  },
  {
    icon: Heart,
    title: 'Patient Wellbeing',
    description: 'Our system is designed to support better patient outcomes by helping healthcare professionals identify potential conditions more efficiently.',
  },
  {
    icon: Scale,
    title: 'Transparency & Fairness',
    description: 'We provide clear explanations for every prediction. Our models are regularly audited for bias and accuracy across diverse patient populations.',
  },
  {
    icon: Users,
    title: 'Physician Empowerment',
    description: 'CBCAI augments—never replaces—medical expertise. Healthcare professionals retain full authority over clinical decisions.',
  },
  {
    icon: Lock,
    title: 'Data Privacy',
    description: 'No patient data is stored or transmitted. All analysis happens in-session, and values are not retained after use.',
  },
];

const guidelines = [
  'Always interpret results in clinical context',
  'Use as one input among many in decision-making',
  'Verify predictions with confirmatory tests',
  'Consider patient history and symptoms',
  'Document AI-assisted insights appropriately',
  'Report any unexpected behaviors or errors',
];

const limitations = [
  'Cannot detect all hematological conditions',
  'Accuracy depends on input data quality',
  'Not validated for pediatric populations',
  'Does not account for medication effects',
  'Cannot replace comprehensive clinical evaluation',
];

export default function About() {
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
              About & <span className="gradient-text">Ethics</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Committed to responsible AI in healthcare. Understanding our principles, 
              limitations, and commitment to clinical safety.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-medical max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="medical-card p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              CBCAI was created to support healthcare professionals in their clinical decision-making 
              by providing AI-assisted interpretation of Complete Blood Count results. We believe 
              that artificial intelligence, when applied responsibly, can enhance—not replace—the 
              expertise of physicians and laboratory doctors.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our goal is to offer transparent, explainable insights that help clinicians identify 
              potential patterns and consider appropriate follow-up tests, ultimately contributing 
              to faster and more informed patient care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ethical Principles */}
      <section className="section-padding bg-muted/30">
        <div className="container-medical">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ethical AI Principles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guiding principles that shape how we develop and deploy our technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ethicalPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="medical-card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 mb-4 flex items-center justify-center">
                  <principle.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
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

      {/* Guidelines & Limitations */}
      <section className="section-padding">
        <div className="container-medical">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Usage Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="medical-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Usage Guidelines</h3>
              </div>
              <ul className="space-y-3">
                {guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Known Limitations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="medical-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Known Limitations</h3>
              </div>
              <ul className="space-y-3">
                {limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding bg-destructive/5">
        <div className="container-medical max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Important Disclaimer</h2>
            <div className="bg-background border-2 border-destructive/20 rounded-xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">CBCAI is intended for clinical decision support only.</strong>
                {' '}It is not a medical device and must not be used as a standalone diagnostic tool. 
                All predictions and recommendations are probabilistic and should be evaluated by 
                qualified healthcare professionals in conjunction with the patient's complete 
                clinical picture, history, and additional diagnostic tests. The developers and 
                operators of this system are not liable for any clinical decisions made based 
                on its outputs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-medical text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Questions or Feedback?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're committed to continuous improvement. Reach out with any questions, 
              concerns, or suggestions for enhancing CBCAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/analyze">
                  Try CBCAI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
