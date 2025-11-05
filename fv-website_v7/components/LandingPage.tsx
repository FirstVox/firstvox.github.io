
import React, { useState } from 'react';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { ShieldCheck, Server, PoliceBadge, Hospital, FireDept, Plane, Zap, Hub } from './icons';
import { AnimatedShield } from './AnimatedShield';
import ContactForm from './ContactForm';

interface LandingPageProps {
  onNavigateToPortal: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 transition-all duration-300 hover:border-brand-primary hover:-translate-y-1 text-left">
    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 text-slate-400">{children}</p>
  </div>
);

const UseCaseCard: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 transition-all duration-300 hover:bg-slate-800">
    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-700 text-accent-cyan">
      {icon}
    </div>
    <h4 className="font-semibold text-white">{title}</h4>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToPortal }) => {
  const { url: logoUrl } = useObjectUrl('/logo.png');
  const [isContactFormVisible, setContactFormVisible] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openContactForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setContactFormVisible(true);
  };

  return (
    <div className="bg-black text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-[-10vw] w-[120vw] h-[120vw] animate-spin-slow">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-brand-primary/50 to-transparent rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent-cyan/40 to-transparent rounded-full filter blur-3xl"></div>
        </div>
        <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(203, 213, 225, 0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
        }}></div>
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-slate-800/50">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#" className="flex items-center">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="FirstVox Logo" 
                  className="h-10 w-10 mr-3 rounded-lg"
                />
              )}
              <span className="text-2xl md:text-3xl font-bold text-white">FirstVox</span>
            </a>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-base font-medium text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#use-cases" onClick={(e) => handleNavClick(e, 'use-cases')} className="text-base font-medium text-slate-300 hover:text-white transition-colors">Use Cases</a>
              <button onClick={openContactForm} className="text-base font-medium text-slate-300 hover:text-white transition-colors">Contact Us</button>
            </div>
            <button
                onClick={onNavigateToPortal}
                className="px-4 py-2 text-sm md:text-base font-semibold text-white bg-transparent border border-white/50 rounded-md hover:bg-white/10 transition-colors"
            >
                Team Portal
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-5rem)] overflow-hidden py-20 px-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
            />
          )}
          
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              Instant Communication,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Uncompromised Security.
              </span>
            </h1>
            <p 
              className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed"
              style={{ animationDelay: '0.2s' }}
            >
              Secure, on-premise AI translation for mission-critical operations. Take full control of your data, eliminate language barriers, and empower your team to act with certainty when every second counts.
            </p>
            <div 
              className="mt-10" 
              style={{ animationDelay: '0.4s' }}
            >
              <button
                onClick={openContactForm}
                className="inline-flex items-center justify-center font-bold text-white bg-brand-primary rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
              >
                Request Early Access
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-900/50 backdrop-blur-lg border-y border-slate-800/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">The FirstVox Advantage</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-400">
              Our platform is engineered from the ground up to eliminate communication barriers when seconds matter most.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<Zap className="w-6 h-6" />} title="Near-Instant Translation">
                Local-processing enables communication faster than live interpreters or cloud based competitors.
              </FeatureCard>
              <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="On-Premise Security">
                All data is processed locally on our revolutionary Translation Hub, enhancing security with compliance in mind.
              </FeatureCard>
              <FeatureCard icon={<Server className="w-6 h-6" />} title="Robust & Scalable">
                Our centralized Translation Hub is built to handle high-stress, large-scale deployments with rock-solid reliability and offline functionality.
              </FeatureCard>
              <FeatureCard icon={<Hub className="w-6 h-6" />} title="No-Hassle Integration">
                Simple where it matters. Connects to your existing network and computers. No upgrades needed.
              </FeatureCard>
            </div>
          </div>
        </section>
        
        {/* Use Cases Section */}
        <section id="use-cases" className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Built for Critical Environments</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-400">
              FirstVox provides a vital communication link across various public and private sector operations.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <UseCaseCard icon={<PoliceBadge className="w-8 h-8" />} title="Public Safety" />
              <UseCaseCard icon={<Hospital className="w-8 h-8" />} title="Healthcare" />
              <UseCaseCard icon={<FireDept className="w-8 h-8" />} title="Emergency Response" />
              <UseCaseCard icon={<Plane className="w-8 h-8" />} title="Transportation Hubs" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900/50 backdrop-blur-lg border-y border-slate-800/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Communicate Faster?</h2>
            <p className="mt-4 max-w-xl mx-auto text-slate-400">
              Join our early access program and be the first to experience the future of real-time translation.
            </p>
            <div className="mt-8">
              <button
                onClick={openContactForm}
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                Request Early Access
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer id="footer" className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FirstVox. All rights reserved.
          </div>
      </footer>

      <ContactForm 
        isVisible={isContactFormVisible} 
        onClose={() => setContactFormVisible(false)} 
      />
    </div>
  );
};
