import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { CBCInputForm } from '@/components/CBCInputForm';
import { Microscope, AlertCircle, Info } from 'lucide-react';

export default function Analyze() {
  return (
    <Layout>
      <section className="section-padding min-h-[calc(100vh-5rem)]">
        <div className="container-medical max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-6">
              <Microscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              CBC Analysis
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your Complete Blood Count values below. Our AI will analyze 
              the patterns and provide probabilistic predictions with clinical insights.
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl mb-8"
          >
            <Info className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">How to use:</strong> Enter available CBC values 
              in the fields below. You don't need to fill all fields – the AI will work with 
              the parameters you provide. Values outside normal ranges will be highlighted.
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="medical-card p-6 md:p-8"
          >
            <CBCInputForm />
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-3 mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Medical Disclaimer:</strong> This system provides 
              AI-assisted analysis for clinical decision support only. Results should be interpreted 
              by qualified healthcare professionals. Do not use as a standalone diagnostic tool.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
