import React, { useState } from 'react';
import { HeartPulse, Droplets, Zap, Wrench, User, Scale, Calculator, HardHat, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const services = [
  { 
    icon: HeartPulse, 
    title: "Healthcare", 
    price: "From $500", 
    description: "Professional medical consultations",
    gradient: "from-[#ff4444] to-[#ff6b6b]",
    glowColor: "rgba(255, 68, 68, 0.3)",
    iconBg: "rgba(255, 68, 68, 0.1)",
    iconColor: "#ff4444"
  },
  { 
    icon: Droplets, 
    title: "Plumbing", 
    price: "From $600", 
    description: "Expert plumbing solutions",
    gradient: "from-[#00F5FF] to-[#00d4ff]",
    glowColor: "rgba(0, 245, 255, 0.3)",
    iconBg: "rgba(0, 245, 255, 0.1)",
    iconColor: "#00F5FF"
  },
  { 
    icon: Zap, 
    title: "Electrician", 
    price: "From $550", 
    description: "Safe electrical services",
    gradient: "from-[#ffaa00] to-[#ffc107]",
    glowColor: "rgba(255, 170, 0, 0.3)",
    iconBg: "rgba(255, 170, 0, 0.1)",
    iconColor: "#ffaa00"
  },
  { 
    icon: Wrench, 
    title: "Mechanic", 
    price: "From $700", 
    description: "Auto repair specialists",
    gradient: "from-[#ff6b35] to-[#f7931e]",
    glowColor: "rgba(255, 107, 53, 0.3)",
    iconBg: "rgba(255, 107, 53, 0.1)",
    iconColor: "#ff6b35"
  },
  { 
    icon: User, 
    title: "Maid Services", 
    price: "From $500", 
    description: "Professional home cleaning",
    gradient: "from-[#FF00FF] to-[#d946ef]",
    glowColor: "rgba(255, 0, 255, 0.3)",
    iconBg: "rgba(255, 0, 255, 0.1)",
    iconColor: "#FF00FF"
  },
  { 
    icon: Scale, 
    title: "Legal Services", 
    price: "From $800", 
    description: "Expert legal consultations",
    gradient: "from-[#8A2BE2] to-[#a855f7]",
    glowColor: "rgba(138, 43, 226, 0.3)",
    iconBg: "rgba(138, 43, 226, 0.1)",
    iconColor: "#8A2BE2"
  },
  { 
    icon: Calculator, 
    title: "CA Experts", 
    price: "From $750", 
    description: "Financial advisory services",
    gradient: "from-[#00ff88] to-[#10b981]",
    glowColor: "rgba(0, 255, 136, 0.3)",
    iconBg: "rgba(0, 255, 136, 0.1)",
    iconColor: "#00ff88"
  },
  { 
    icon: HardHat, 
    title: "Construction", 
    price: "From $800", 
    description: "Building & renovation",
    gradient: "from-[#f59e0b] to-[#d97706]",
    glowColor: "rgba(245, 158, 11, 0.3)",
    iconBg: "rgba(245, 158, 11, 0.1)",
    iconColor: "#f59e0b"
  },
];

interface ServicesProps {
  onSelectCategory: (category: string) => void;
}

// Card Component with enhanced hover effects
const ServiceCard = ({ 
  service, 
  index, 
  onSelect 
}: { 
  service: typeof services[0]; 
  index: number; 
  onSelect: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className="group relative cursor-pointer"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${service.glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />

      {/* Card */}
      <div 
        className="relative p-8 rounded-[2rem] transition-all duration-500 overflow-hidden h-full"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: isHovered 
            ? `1px solid ${service.iconColor}50` 
            : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: isHovered 
            ? `0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px ${service.glowColor}` 
            : '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Background Gradient on Hover */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${service.iconBg} 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.3
          }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)'
          }}
        />
        
        {/* Icon Container */}
        <motion.div 
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: service.iconBg,
            border: `1px solid ${service.iconColor}30`
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            boxShadow: `0 0 30px ${service.glowColor}`
          }}
          transition={{ duration: 0.3 }}
        >
          <service.icon 
            className="w-8 h-8 transition-all duration-300" 
            style={{ 
              color: service.iconColor,
              filter: `drop-shadow(0 0 10px ${service.iconColor})`
            }} 
          />
        </motion.div>

        {/* Content */}
        <h3 
          className="text-xl font-black font-headline mb-2 tracking-tight transition-colors duration-300"
          style={{ color: isHovered ? service.iconColor : 'white' }}
        >
          {service.title}
        </h3>
        <p className="text-sm text-on-surface-variant mb-4 opacity-70">
          {service.description}
        </p>
        <p 
          className="text-xs font-bold uppercase tracking-widest mb-6"
          style={{ color: service.iconColor, opacity: 0.8 }}
        >
          {service.price}
        </p>
        
        {/* CTA */}
        <motion.div 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: service.iconColor }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3 }}
        >
          View Experts 
          <motion.span
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.div>

        {/* Corner Accent */}
        <div 
          className="absolute bottom-0 right-0 w-24 h-24 opacity-10"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${service.iconColor} 50%)`
          }}
        />
      </div>
    </motion.div>
  );
};

export const Services: React.FC<ServicesProps> = ({ onSelectCategory }) => {
  return (
    <section id="expert-network" className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.05) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
      </div>
      
      <div className="branded-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
                border: '1px solid rgba(0, 245, 255, 0.2)'
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Expert Network
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black font-headline mb-8 leading-[0.95] tracking-[-0.04em]"
            >
              <span className="text-white">PREMIUM</span>
              <br />
              <span 
                style={{
                  background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 50%, #FF00FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                VERIFIED SERVICES.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-on-surface-variant font-medium max-w-xl leading-relaxed"
            >
              Every professional undergoes a{' '}
              <span className="text-primary font-semibold">12-point AI verification</span>{' '}
              process before joining our network. Quality is non-negotiable.
            </motion.p>
          </div>

          <motion.button 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="flex items-center gap-3">
              Explore All
              <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onSelect={() => onSelectCategory(service.title)}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-8 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(0, 245, 255, 0.1)'
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Verified Experts', color: '#00F5FF' },
              { value: '50K+', label: 'Jobs Completed', color: '#8A2BE2' },
              { value: '4.9', label: 'Average Rating', color: '#FF00FF' },
              { value: '24/7', label: 'Support Available', color: '#00ff88' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <div 
                  className="text-4xl font-black font-headline mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
