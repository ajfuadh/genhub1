import React from 'react';
import { UserPlus, Target, Calendar, Award, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: UserPlus,
    title: "Instant Registration",
    description: "Secure OTP onboarding with biometric linkage.",
    color: "#00F5FF",
    step: "01"
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Hyper-local algorithmic matching based on specific needs.",
    color: "#8A2BE2",
    step: "02"
  },
  {
    icon: Calendar,
    title: "Effortless Booking",
    description: "Transparent scheduling and encrypted payment vault.",
    color: "#FF00FF",
    step: "03"
  },
  {
    icon: Award,
    title: "Service Excellence",
    description: "Real-time tracking and verified review ecosystem.",
    color: "#00ff88",
    step: "04"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
      </div>

      {/* Animated Line */}
      <div className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2 -z-10 hidden lg:block">
        <motion.div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 245, 255, 0.3) 20%, rgba(138, 43, 226, 0.3) 50%, rgba(255, 0, 255, 0.3) 80%, transparent 100%)'
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
      </div>
      
      <div className="branded-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
              border: '1px solid rgba(138, 43, 226, 0.2)'
            }}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
              Our Process
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black font-headline mb-6 leading-tight tracking-[-0.04em]"
          >
            <span className="text-white">PRECISION ENGINEERING</span>
            <br />
            <span className="text-white">OF </span>
            <span 
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 50%, #FF00FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              TRUST.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-on-surface-variant font-medium max-w-2xl mx-auto"
          >
            Four steps to seamless, secure service delivery. Every interaction is{' '}
            <span className="text-primary font-semibold">monitored and verified</span> in real-time.
          </motion.p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px">
                  <motion.div
                    className="w-full h-full"
                    style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  />
                </div>
              )}

              <div 
                className="relative h-full p-8 rounded-[2rem] transition-all duration-500 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Glow on Hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${step.color}15 0%, transparent 70%)`
                  }}
                />

                {/* Step Number */}
                <motion.div
                  className="absolute top-6 right-6 text-6xl font-black font-headline opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ color: step.color }}
                >
                  {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                  style={{
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: `0 0 40px ${step.color}40`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon 
                    className="w-8 h-8" 
                    style={{ 
                      color: step.color,
                      filter: `drop-shadow(0 0 10px ${step.color})`
                    }}
                  />
                </motion.div>

                {/* Content */}
                <h3 
                  className="text-lg font-black font-headline mb-3 tracking-tight group-hover:text-white transition-colors"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                  {step.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <ArrowRight className="w-5 h-5" style={{ color: step.color }} />
                </motion.div>

                {/* Border Gradient on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `1px solid ${step.color}40`,
                    boxShadow: `0 0 30px ${step.color}15`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              color: '#00F5FF'
            }}
          >
            Learn More About Our Process
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
