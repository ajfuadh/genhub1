import React from 'react';
import { 
  ShieldAlert, Fingerprint, Eye, Lock, 
  Scan, FileSearch, Award, Database, 
  CreditCard, MapPin, Activity, Zap,
  Cpu, ShieldCheck, Key
} from 'lucide-react';
import { motion } from 'motion/react';

export const Security = () => {
  const securityPillars = [
    {
      title: "AI Verification Protocol",
      icon: <Cpu className="w-6 h-6 text-primary" />,
      description: "Our multi-layered identity anchoring system ensures every professional is exactly who they claim to be.",
      points: [
        { icon: <Scan className="w-4 h-4" />, label: "Biometric Identity", detail: "Facial recognition anchoring for every job start." },
        { icon: <FileSearch className="w-4 h-4" />, label: "Document Intelligence", detail: "AI-powered analysis of licenses and background checks." },
        { icon: <Award className="w-4 h-4" />, label: "Skill Certification", detail: "Automated testing and verification of expertise." }
      ]
    },
    {
      title: "Military-Grade Encryption",
      icon: <ShieldCheck className="w-6 h-6 text-tertiary" />,
      description: "We treat your data with the same level of security as a financial institution.",
      points: [
        { icon: <Lock className="w-4 h-4" />, label: "E2E Communication", detail: "All chats and data transfers are end-to-end encrypted." },
        { icon: <Database className="w-4 h-4" />, label: "Secure Data Vault", detail: "Information stored in isolated, encrypted modules." },
        { icon: <CreditCard className="w-4 h-4" />, label: "Payment Tokenization", detail: "Financial data is tokenized at the source." }
      ]
    },
    {
      title: "Real-Time Monitoring",
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      description: "Continuous oversight during every service window to ensure safety and precision.",
      points: [
        { icon: <MapPin className="w-4 h-4" />, label: "Live GPS Tracking", detail: "Real-time location monitoring during active service." },
        { icon: <Zap className="w-4 h-4" />, label: "Anomaly Detection", detail: "AI detects deviations from standard service patterns." },
        { icon: <ShieldAlert className="w-4 h-4" />, label: "SOS Integration", detail: "Direct connection to emergency responders." }
      ]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-tertiary/5 blur-[120px] -z-10" />
      
      <div className="branded-container relative z-10 space-y-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[3rem] blur-3xl opacity-30" />
              <div className="relative bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl">
                <div className="flex items-start gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                  <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight mb-1.5 text-base">Biometric Anchoring</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">Professionals verify identity via facial recognition before every job start.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-tertiary/30 transition-all duration-500 group">
                  <div className="p-3.5 rounded-2xl bg-tertiary/10 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all duration-500 shadow-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight mb-1.5 text-base">Real-time Monitoring</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">AI-driven anomaly detection monitors service duration and location accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all duration-500 group">
                  <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight mb-1.5 text-base">Encrypted Vault</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">Your data and payment information are secured with military-grade encryption.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-black tracking-[0.2em] uppercase">
              <ShieldAlert className="w-4 h-4" />
              Zero Trust Architecture
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-headline leading-[0.9] text-white">
              SECURITY ISN'T A FEATURE, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-primary">IT'S OUR FOUNDATION.</span>
            </h2>
            <p className="text-base text-on-surface-variant leading-relaxed font-medium opacity-70">
              We've built the world's first service ecosystem that treats every interaction as a mission-critical operation. No more guessing, no more risks.
            </p>
            <ul className="space-y-4">
              {['Background checks refreshed every 30 days', 'AI-verified skill certifications', 'Secure escrow payment system', 'Instant emergency response linkage'].map((item) => (
                <li key={item} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white group">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:scale-150 transition-transform" />
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Detailed Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight">{pillar.title}</h3>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-60 mb-8">
                {pillar.description}
              </p>
              <div className="space-y-6">
                {pillar.points.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-4">
                    <div className="mt-1 p-1.5 rounded-lg bg-white/5 text-on-surface-variant/60">
                      {point.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{point.label}</p>
                      <p className="text-[9px] text-on-surface-variant font-medium opacity-50 leading-normal">{point.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
