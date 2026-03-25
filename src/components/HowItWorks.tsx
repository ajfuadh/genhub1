import React from 'react';
import { UserPlus, Target, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: UserPlus,
    title: "1. Instant Registration",
    description: "Secure OTP onboarding with biometric linkage."
  },
  {
    icon: Target,
    title: "2. Precision Matching",
    description: "Hyper-local algorithmic matching based on specific needs."
  },
  {
    icon: Calendar,
    title: "3. Effortless Booking",
    description: "Transparent scheduling and encrypted payment vault."
  },
  {
    icon: Award,
    title: "4. Service Excellence",
    description: "Real-time tracking and verified review ecosystem."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-surface-container-lowest/50 -z-10" />
      <div className="absolute -top-24 left-1/4 w-64 h-64 bg-tertiary/5 blur-[100px] rounded-full" />
      
      <div className="branded-container relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-tertiary mb-5"
          >
            Our Process
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-4xl font-black font-headline mb-4 leading-tight text-white tracking-[-0.04em]"
          >
            PRECISION ENGINEERING <br /> OF <span className="text-tertiary">TRUST.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-on-surface-variant font-medium max-w-xl mx-auto opacity-70"
          >
            Four steps to seamless, secure service delivery. Every interaction is monitored and verified in real-time.
          </motion.p>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative z-10 group"
            >
              <div className="h-72 glass-card p-8 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center justify-center transition-all duration-700 hover:bg-white/[0.07] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black font-headline mb-3 tracking-tight text-white">{step.title}</h3>
                <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed px-2 opacity-70 group-hover:opacity-100 transition-opacity">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
