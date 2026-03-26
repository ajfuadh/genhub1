import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, BrainCircuit, Headphones, ChevronDown, Sparkles, Zap, Star } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';

interface HeroProps {
  onBecomePro: () => void;
  hasOnboarded?: boolean;
  onGoToDashboard?: () => void;
  onBookClick: () => void;
}

// Animated background orb component
const AnimatedOrb = ({ 
  className, 
  delay = 0,
  duration = 20 
}: { 
  className: string; 
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
      x: [0, 30, -30, 0],
      y: [0, -40, 20, 0],
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={className}
  />
);

// Floating particle component
const FloatingParticle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    animate={{ 
      opacity: [0, 1, 0],
      y: [-20, -200],
      x: [0, Math.random() * 100 - 50]
    }}
    transition={{ 
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay,
      ease: "easeOut"
    }}
    className="absolute w-1 h-1 bg-primary/60 rounded-full"
    style={{ 
      left: `${Math.random() * 100}%`,
      bottom: '10%'
    }}
  />
);

// Animated text reveal component
const AnimatedText = ({ 
  text, 
  delay = 0,
  className = "",
  gradient = false
}: { 
  text: string; 
  delay?: number;
  className?: string;
  gradient?: boolean;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 80, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`block ${gradient ? 'text-gradient-animate' : ''} ${className}`}
    >
      {text}
    </motion.span>
  );
};

// Interactive card with 3D tilt effect
const TiltCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ 
        rotateX: rotateXSpring, 
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onBecomePro, hasOnboarded, onGoToDashboard, onBookClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: CheckCircle2, label: "10k+ Experts", description: "Verified professionals" },
    { icon: BrainCircuit, label: "AI Matching", description: "Smart recommendations" },
    { icon: Headphones, label: "24/7 Support", description: "Always available" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        {/* Aurora gradient background */}
        <div className="absolute inset-0 aurora-bg opacity-50" />
        
        {/* Animated orbs */}
        <AnimatedOrb 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-morph" 
          delay={0}
          duration={15}
        />
        <AnimatedOrb 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/15 blur-[140px] rounded-full animate-morph" 
          delay={3}
          duration={20}
        />
        <AnimatedOrb 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-tertiary/10 blur-[100px] rounded-full" 
          delay={5}
          duration={18}
        />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        {/* Animated scan line */}
        <motion.div 
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </div>

      {/* Mouse follower gradient */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none -z-10"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      <div className="branded-container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Announcement Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-container/80 border border-primary/20 backdrop-blur-xl shadow-lg shadow-primary/10 mb-10 cursor-pointer group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-on-surface transition-colors">
              New: AI-Powered Matching
            </span>
            <motion.span 
              className="text-primary text-[10px] font-bold"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Learn more
            </motion.span>
          </motion.div>
        </motion.div>
        
        {/* Main Headline with Staggered Animation */}
        <div className="space-y-2 mb-8 perspective-1000">
          <div className="overflow-hidden">
            <AnimatedText 
              text="Super fast motion" 
              delay={0.1}
              className="text-5xl md:text-7xl lg:text-8xl font-black font-headline leading-[0.9] tracking-[-0.04em] text-on-surface"
            />
          </div>
          <div className="overflow-hidden">
            <AnimatedText 
              text="for every team" 
              delay={0.2}
              className="text-5xl md:text-7xl lg:text-8xl font-black font-headline leading-[0.9] tracking-[-0.04em]"
              gradient
            />
          </div>
        </div>

        {/* Subtitle with fade in */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base md:text-lg text-on-surface-variant leading-relaxed font-medium max-w-xl mx-auto mb-12"
        >
          Connect with trusted professionals. Our AI-driven verification ensures every interaction is anchored in absolute certainty.
        </motion.p>

        {/* CTA Buttons with Magnetic Effect */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <motion.button 
            onClick={onBookClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 bg-primary text-surface rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all text-sm tracking-tight overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a Service
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Zap className="w-4 h-4" />
              </motion.span>
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
              animate={{ backgroundPosition: isHovered ? ['0%', '100%'] : '0%' }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
          
          <motion.button 
            onClick={hasOnboarded ? onGoToDashboard : onBecomePro}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group px-10 py-5 bg-surface-container/80 backdrop-blur-xl border border-white/10 text-on-surface rounded-2xl font-bold hover:bg-surface-container hover:border-primary/30 transition-all text-sm tracking-tight"
          >
            <span className="flex items-center gap-2">
              {hasOnboarded ? "Go to Dashboard" : "Become a Pro"}
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-4 h-4 text-secondary" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Feature Cards with 3D Tilt */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
        >
          {features.map((item, i) => (
            <TiltCard key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-2xl glass-card-hover cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 mx-auto group-hover:bg-primary group-hover:text-surface transition-all duration-300"
                >
                  <item.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-sm font-bold text-on-surface mb-1">{item.label}</h3>
                <p className="text-xs text-on-surface-variant">{item.description}</p>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>
      </div>

      {/* Floating Status Cards */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute top-1/3 right-[5%] hidden xl:block"
      >
        <TiltCard>
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card p-6 rounded-2xl border border-primary/20 shadow-xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-500"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live</span>
            </div>
            <p className="text-sm font-bold text-on-surface">2,847 experts online</p>
            <p className="text-xs text-on-surface-variant">Ready to help you</p>
          </motion.div>
        </TiltCard>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-1/3 left-[5%] hidden xl:block"
      >
        <TiltCard>
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass-card p-6 rounded-2xl border border-secondary/20 shadow-xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ShieldCheck className="w-4 h-4 text-secondary" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Secure</span>
            </div>
            <p className="text-sm font-bold text-on-surface">AES-256 Encryption</p>
            <p className="text-xs text-on-surface-variant">Bank-grade security</p>
          </motion.div>
        </TiltCard>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.span 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
        >
          Scroll to explore
        </motion.span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-on-surface-variant/30 flex items-start justify-center p-2"
        >
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
