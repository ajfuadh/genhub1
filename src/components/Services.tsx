import React from 'react';
import { HeartPulse, Droplets, Zap, Wrench, User, Scale, Calculator, HardHat } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  { icon: HeartPulse, title: "Healthcare", price: "From ₹500", color: "bg-red-500/10 text-red-400" },
  { icon: Droplets, title: "Plumbing", price: "From ₹600", color: "bg-cyan-500/10 text-cyan-400" },
  { icon: Zap, title: "Electrician", price: "From ₹550", color: "bg-yellow-500/10 text-yellow-400" },
  { icon: Wrench, title: "Mechanic", price: "From ₹700", color: "bg-orange-500/10 text-orange-400" },
  { icon: User, title: "Maid Services", price: "From ₹500", color: "bg-pink-500/10 text-pink-400" },
  { icon: Scale, title: "Legal Services", price: "From ₹800", color: "bg-indigo-500/10 text-indigo-400" },
  { icon: Calculator, title: "CA Experts", price: "From ₹750", color: "bg-emerald-500/10 text-emerald-400" },
  { icon: HardHat, title: "Construction", price: "From ₹800", color: "bg-amber-500/10 text-amber-400" },
];

interface ServicesProps {
  onSelectCategory: (category: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectCategory }) => {
  return (
    <section id="expert-network" className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] -z-10" />
      
      <div className="branded-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-5"
            >
              Expert Network
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl lg:text-4xl font-black font-headline mb-6 leading-[0.95] text-white tracking-[-0.04em]"
            >
              PREMIUM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">VERIFIED SERVICES.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-on-surface-variant font-medium max-w-xl opacity-70"
            >
              Every professional undergoes a 12-point AI verification process before joining our network. Quality is non-negotiable.
            </motion.p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all text-white"
          >
            Explore All
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 }
              }}
              onClick={() => onSelectCategory(service.title)}
              className="group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.08] hover:border-primary/30 cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              
              <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black font-headline mb-2 tracking-tight text-white">{service.title}</h3>
              <p className="text-[10px] text-on-surface-variant mb-6 font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{service.price}</p>
              
              <div className="flex items-center gap-3 text-[9px] font-black text-primary uppercase tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                View Experts <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
