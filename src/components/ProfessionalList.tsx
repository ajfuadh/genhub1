import React from 'react';
import { Star, ShieldCheck, MapPin, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Professional } from '../types';

interface ProfessionalListProps {
  category: string;
  professionals: Professional[];
  onSelect: (professional: Professional) => void;
  onClose: () => void;
}

export const ProfessionalList: React.FC<ProfessionalListProps> = ({ category, professionals, onSelect, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-surface/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card rounded-[2.5rem] border border-white/5 shadow-2xl p-10 md:p-16"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold font-headline mb-6 tracking-tight">
            Verified <span className="text-primary">{category}</span> Experts.
          </h2>
          <p className="text-base text-on-surface-variant font-medium">Top-rated professionals with AI-verified skills and background checks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {professionals.length > 0 ? (
            professionals.map((pro) => (
              <motion.div 
                key={pro.id}
                whileHover={{ y: -4 }}
                onClick={() => onSelect(pro)}
                className="p-8 rounded-[2rem] bg-surface-container-low border border-outline-variant/5 hover:border-primary/20 hover:bg-surface-container-high transition-all cursor-pointer group"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={pro.imageUrl} 
                      alt={pro.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-lg group-hover:border-primary/40 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold tracking-tight">{pro.name}</h3>
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            {pro.rating >= 4.8 && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[7px] font-black uppercase tracking-widest border border-amber-500/20">
                                Top Rated
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-primary font-bold uppercase tracking-widest">{pro.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-tertiary bg-tertiary/5 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs font-black">{pro.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {pro.location || 'Near You'}
                    </span>
                    <span>{pro.experience} Exp.</span>
                    {pro.degree && <span className="text-tertiary">{pro.degree}</span>}
                    <span className="text-primary tracking-widest">₹{pro.pricePerHour}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {pro.verificationBadges.slice(0, 2).map((badge, idx) => (
                      <span key={`${pro.id}-badge-${idx}`} className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-[8px] font-black text-green-500 uppercase tracking-widest">
                        <ShieldCheck className="w-2.5 h-2.5" /> {badge}
                      </span>
                    ))}
                    {pro.skills.slice(0, 2).map((skill, idx) => (
                      <span key={`${pro.id}-skill-${idx}`} className="px-3 py-1 rounded-lg bg-primary/5 text-[9px] font-bold text-primary/80 uppercase tracking-[0.15em]">
                        {skill}
                      </span>
                    ))}
                  </div>
                  </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-primary/30" />
              </div>
              <h3 className="text-xl font-bold mb-2">No experts found in this category</h3>
              <p className="text-on-surface-variant">We're currently onboarding new verified professionals in this area.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
