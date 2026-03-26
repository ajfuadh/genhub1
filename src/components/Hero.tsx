import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, BrainCircuit, Headphones, ChevronDown, Sparkles, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onBecomePro: () => void;
  hasOnboarded?: boolean;
  onGoToDashboard?: () => void;
  onBookClick: () => void;
}

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Floating Particle Component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        y: [-20, -100, -200, -300],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
      }}
      transition={{ 
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
      className="absolute w-1 h-1 rounded-full bg-primary"
      style={{ 
        left: `${Math.random() * 100}%`,
        bottom: 0,
        boxShadow: '0 0 10px #00F5FF, 0 0 20px #00F5FF'
      }}
    />
  );
};

export const Hero: React.FC<HeroProps> = ({ onBecomePro, hasOnboarded, onGoToDashboard, onBookClick }) => {
  const titleWords = ["SECURE.", "VERIFIED.", "SERVICES."];
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % titleWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 80, 0],
          y: [0, -50, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          x: [0, -100, 0],
          y: [0, 60, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255, 0, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 245, 255, 0.3)" strokeWidth="0.5"/>
            </pattern>
            <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="50%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#fade)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)"/>
        </svg>
      </div>
      
      <div className="branded-container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.2), inset 0 0 20px rgba(0, 245, 255, 0.05)'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-primary icon-glow-cyan" />
          </motion.div>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">
            Next-Gen Security Ecosystem
          </span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ boxShadow: '0 0 10px #00ff88' }} />
        </motion.div>
        
        {/* Main Title with Neon Effect */}
        <div className="space-y-2 mb-10">
          <div className="overflow-hidden">
            {titleWords.map((word, i) => (
              <motion.h1 
                key={i}
                initial={{ opacity: 0, y: 100, skewY: 5 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.15, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={`text-5xl md:text-7xl lg:text-8xl font-black font-headline leading-[0.9] tracking-[-0.05em] ${
                  i === 2 ? "" : "text-white"
                }`}
                style={i === 2 ? {
                  background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 50%, #FF00FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 30px rgba(0, 245, 255, 0.3))'
                } : {
                  textShadow: activeWordIndex === i ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none'
                }}
              >
                {word}
              </motion.h1>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="text-base md:text-lg text-on-surface-variant leading-relaxed font-medium max-w-2xl mx-auto mt-8"
          >
            Connect with trusted professionals — anytime, anywhere. Our{' '}
            <span className="text-primary font-semibold">AI-driven verification layer</span>{' '}
            ensures every interaction is anchored in absolute certainty.
          </motion.p>
        </div>

        {/* CTA Buttons with Enhanced Effects */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
          className="flex flex-col sm:flex-row items-center gap-5 mb-16"
        >
          <motion.button 
            onClick={onBookClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)',
              boxShadow: '0 20px 60px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.2)'
            }}
          >
            <span className="relative z-10 text-surface-container-lowest flex items-center gap-3">
              <Zap className="w-5 h-5" />
              Book a Service
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
          
          <motion.button 
            onClick={hasOnboarded ? onGoToDashboard : onBecomePro}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] text-white transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
              {hasOnboarded ? "Go to Dashboard" : "Become a Pro"}
            </span>
          </motion.button>
        </motion.div>

        {/* Stats with Animated Counters */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16 pt-12 w-full"
          style={{
            borderTop: '1px solid rgba(0, 245, 255, 0.1)'
          }}
        >
          {[
            { icon: CheckCircle2, label: "Verified Experts", value: 10000, suffix: "+", color: "#00F5FF" },
            { icon: BrainCircuit, label: "AI Matching", value: 99, suffix: "%", color: "#8A2BE2" },
            { icon: Headphones, label: "Support Uptime", value: 24, suffix: "/7", color: "#FF00FF" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="flex flex-col items-center gap-4 group cursor-default"
            >
              <motion.div 
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500"
                style={{
                  background: `rgba(${item.color === '#00F5FF' ? '0, 245, 255' : item.color === '#8A2BE2' ? '138, 43, 226' : '255, 0, 255'}, 0.1)`,
                  border: `1px solid ${item.color}30`,
                }}
                whileHover={{
                  boxShadow: `0 0 40px ${item.color}40`,
                  borderColor: `${item.color}80`
                }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
                <div className="pulse-ring" style={{ 
                  background: item.color,
                  width: '100%',
                  height: '100%',
                  opacity: 0.3
                }} />
              </motion.div>
              <div className="text-center">
                <div className="text-3xl font-black font-headline mb-1" style={{ color: item.color }}>
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Interactive Cards */}
      <motion.div 
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, 3, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-[3%] hidden xl:block"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-3xl neon-border"
          style={{ minWidth: '220px' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-success" style={{ boxShadow: '0 0 15px #00ff88' }} />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping opacity-50" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-success">Live Protection</span>
          </div>
          <p className="text-sm font-bold text-white/80">Biometric verified 0.4s ago</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full overflow-hidden bg-white/10">
              <motion.div 
                className="h-full bg-success rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-[10px] text-success font-bold">Active</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-1/3 left-[3%] hidden xl:block"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="glass-card p-6 rounded-3xl"
          style={{ 
            minWidth: '220px',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            boxShadow: '0 0 30px rgba(138, 43, 226, 0.1)'
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-secondary icon-glow-purple" />
            <span className="text-xs font-black uppercase tracking-widest text-secondary">Secure Vault</span>
          </div>
          <p className="text-sm font-bold text-white/80">AES-256 Encryption Active</p>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-1 rounded-full"
                style={{ background: i < 4 ? '#8A2BE2' : 'rgba(255,255,255,0.1)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1 * i }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">Explore</span>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <ChevronDown className="w-6 h-6 text-primary" />
          <div className="absolute inset-0 blur-md">
            <ChevronDown className="w-6 h-6 text-primary opacity-50" />
          </div>
        </motion.div>
        <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
};
