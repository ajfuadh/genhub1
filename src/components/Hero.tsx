import React from 'react';
import { ShieldCheck, CheckCircle2, BrainCircuit, Headphones, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onBecomePro: () => void;
  hasOnboarded?: boolean;
  onGoToDashboard?: () => void;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBecomePro, hasOnboarded, onGoToDashboard, onBookClick }) => {
  const titleWords = ["SECURE.", "VERIFIED.", "SERVICES."];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Immersive Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, 40, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-tertiary/15 blur-[160px] rounded-full -z-10" 
      />

      {/* High-Tech Overlays */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none -z-10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-scanline opacity-20" />
      </div>
      
      <div className="branded-container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[9px] font-black tracking-[0.3em] uppercase mb-10 backdrop-blur-2xl shadow-2xl"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Next-Gen Security Ecosystem
        </motion.div>
        
        <div className="space-y-3 mb-8">
          <div className="overflow-hidden">
            {titleWords.map((word, i) => (
              <motion.h1 
                key={i}
                initial={{ opacity: 0, y: 100, skewY: 5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={`text-5xl md:text-7xl font-black font-headline leading-[0.85] tracking-[-0.05em] ${
                  i === 2 ? "text-transparent bg-clip-text bg-gradient-to-b from-primary via-tertiary to-secondary" : "text-white"
                }`}
              >
                {word}
              </motion.h1>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-base md:text-lg text-on-surface-variant leading-relaxed font-medium max-w-xl mx-auto opacity-70"
          >
            Connect with trusted professionals — anytime, anywhere. Our AI-driven verification layer ensures every interaction is anchored in absolute certainty.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-12"
        >
          <button 
            onClick={onBookClick}
            className="group relative px-10 py-5 bg-primary text-on-primary-container rounded-2xl font-black shadow-[0_20px_60px_rgba(59,130,246,0.4)] hover:scale-105 hover:shadow-[0_30px_80px_rgba(59,130,246,0.6)] transition-all text-xs uppercase tracking-[0.12em] overflow-hidden"
          >
            <span className="relative z-10">Book a Service</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <button 
            onClick={hasOnboarded ? onGoToDashboard : onBecomePro}
            className="px-10 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-2xl font-black hover:bg-white/10 hover:scale-105 transition-all text-xs uppercase tracking-[0.12em] shadow-xl"
          >
            {hasOnboarded ? "Go to Dashboard" : "Become a Pro"}
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-white/10 pt-12 w-full"
        >
          {[
            { icon: CheckCircle2, label: "10k+ Experts" },
            { icon: BrainCircuit, label: "AI Matching" },
            { icon: Headphones, label: "24/7 Support" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3 group cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-tertiary mb-1 group-hover:bg-tertiary group-hover:text-white transition-all duration-500 shadow-lg">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant group-hover:text-white transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Interactive Elements */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[5%] hidden xl:block"
      >
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Live Protection</span>
          </div>
          <p className="text-sm font-bold text-white opacity-80">Biometric verified 0.4s ago</p>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-[5%] hidden xl:block"
      >
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">Secure Vault</span>
          </div>
          <p className="text-sm font-bold text-white opacity-80">AES-256 Encryption Active</p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};
