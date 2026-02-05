import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ResultCard } from '@/components/ResultCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, AlertCircle, Download, Loader2 } from 'lucide-react';

// Mock predictions data
const mockPredictions = [
  {
    condition: 'Iron Deficiency Anemia',
    probability: 78,
    keyFeatures: ['Low Hemoglobin', 'Low MCV (Microcytic)', 'High RDW', 'Low MCH'],
    reasoning: 'The combination of reduced hemoglobin levels with microcytic indices (low MCV, MCH) and elevated RDW strongly suggests iron deficiency anemia. This is the most common cause of microcytic anemia and is characterized by reduced iron stores leading to impaired hemoglobin synthesis.',
    confirmatoryTests: [
      { name: 'Serum Ferritin', reason: 'Primary marker for iron stores; low ferritin confirms iron deficiency' },
      { name: 'Serum Iron & TIBC', reason: 'Low serum iron with elevated TIBC indicates iron deficiency' },
      { name: 'Reticulocyte Count', reason: 'Helps assess bone marrow response to anemia' },
    ],
  },
  {
    condition: 'Thalassemia Trait',
    probability: 15,
    keyFeatures: ['Low MCV', 'Normal/High RBC Count', 'Borderline Hemoglobin'],
    reasoning: 'The microcytic indices with relatively preserved or elevated RBC count may suggest thalassemia trait. Unlike iron deficiency, thalassemia typically shows normal RDW and Mentzer index below 13.',
    confirmatoryTests: [
      { name: 'Hemoglobin Electrophoresis', reason: 'Identifies abnormal hemoglobin variants characteristic of thalassemia' },
      { name: 'HbA2 Quantification', reason: 'Elevated HbA2 (>3.5%) confirms beta-thalassemia trait' },
      { name: 'Genetic Testing', reason: 'Definitive diagnosis through alpha/beta globin gene analysis' },
    ],
  },
  {
    condition: 'Anemia of Chronic Disease',
    probability: 7,
    keyFeatures: ['Low Hemoglobin', 'Normal/Low MCV', 'Normal RDW'],
    reasoning: 'Chronic inflammatory conditions can cause anemia through iron sequestration and reduced erythropoiesis. This pattern shows normocytic or mildly microcytic anemia with normal variation in red cell size.',
    confirmatoryTests: [
      { name: 'C-Reactive Protein (CRP)', reason: 'Elevated CRP indicates underlying inflammation' },
      { name: 'Serum Ferritin', reason: 'Normal or elevated ferritin despite anemia suggests ACD' },
      { name: 'Transferrin Saturation', reason: 'Low transferrin saturation with normal/high ferritin supports ACD' },
    ],
  },
];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<typeof mockPredictions>([]);

  useEffect(() => {
    // Check if we have CBC values from the form
    if (!location.state?.cbcValues) {
      navigate('/analyze');
      return;
    }

    // Simulate AI analysis
    const timer = setTimeout(() => {
      setPredictions(mockPredictions);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <section className="section-padding min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-secondary/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing CBC Results</h2>
            <p className="text-muted-foreground">
              AI is processing patterns and generating predictions...
            </p>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-medical max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/analyze">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Analysis
                </Link>
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Analysis Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on the provided CBC values, our AI has identified the following 
              most probable conditions with supporting reasoning.
            </p>
          </motion.div>

          {/* Results */}
          <div className="space-y-4 mb-8">
            {predictions.map((prediction, index) => (
              <ResultCard
                key={prediction.condition}
                prediction={prediction}
                rank={index + 1}
                index={index}
              />
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Button variant="hero" asChild className="flex-1">
              <Link to="/analyze">
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 bg-warning/10 border border-warning/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These results are generated by an AI system designed for <strong>clinical decision support only</strong>. 
                  The predictions and recommendations should be evaluated by qualified healthcare professionals 
                  in the context of the patient's complete clinical picture. This system does not replace 
                  professional medical judgment and should never be used as a standalone diagnostic tool.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
