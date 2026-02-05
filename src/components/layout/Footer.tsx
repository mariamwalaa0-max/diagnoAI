import { Link } from 'react-router-dom';
import { Activity, Mail, Shield, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-medical py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">
                CBC<span className="text-secondary">AI</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              AI-powered CBC analysis for smarter clinical insights. 
              Supporting healthcare professionals with explainable, 
              probabilistic medical AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/analyze" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Analyze CBC
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  About & Ethics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="bg-primary-foreground/10 rounded-xl p-4 mb-6">
            <p className="text-xs text-primary-foreground/80 text-center">
              <strong>Medical Disclaimer:</strong> This system is intended for clinical decision support only 
              and must not be used as a standalone diagnostic tool. Always consult qualified healthcare 
              professionals for medical decisions.
            </p>
          </div>
          <p className="text-center text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} CBCAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
