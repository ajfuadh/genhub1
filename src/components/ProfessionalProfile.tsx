import React from 'react';
import { ShieldCheck, Star, Award, CheckCircle2, X, Clock, Calendar, Circle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Professional } from '../types';

interface ProfessionalProfileProps {
  professional: Professional;
  onClose: () => void;
  onBook: () => void;
}

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({ professional, onClose, onBook }) => {
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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-[2.5rem] border border-white/5 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 p-10 md:p-16">
          {/* Sidebar: Image & Quick Stats */}
          <div className="space-y-8">
            <div className="relative">
              <img 
                src={professional.imageUrl} 
                alt={professional.name} 
                className="w-full aspect-square object-cover rounded-[2rem] border border-primary/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -right-4 bg-tertiary text-on-tertiary px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl">
                <Star className="w-4 h-4 fill-current" />
                {professional.rating}
              </div>
            </div>

            <div className="space-y-5 pt-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold">
                <span className="text-on-surface-variant">Experience</span>
                <span className="text-on-surface">{professional.experience}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold">
                <span className="text-on-surface-variant">Reviews</span>
                <span className="text-on-surface">{professional.reviewCount}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold">
                <span className="text-on-surface-variant">Starting From</span>
                <span className="text-primary">₹{professional.pricePerHour}</span>
              </div>
            </div>

            <button 
              onClick={onBook}
              className="w-full py-5 bg-primary text-on-primary-container rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all uppercase tracking-widest text-xs"
            >
              Book Appointment
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-3xl font-bold font-headline tracking-tight">{professional.name}</h2>
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-primary font-bold uppercase tracking-[0.2em]">
                <span>{professional.title}</span>
                {professional.degree && (
                  <>
                    <span className="text-on-surface-variant/20">•</span>
                    <span className="text-tertiary">{professional.degree}</span>
                  </>
                )}
              </div>
              {professional.location && (
                <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  {professional.location}
                </div>
              )}
            </div>

            {professional.specialization && (
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                  <Award className="w-4 h-4" /> Core Specialization
                </h3>
                <p className="text-lg font-bold tracking-tight text-on-surface">
                  {professional.specialization}
                </p>
              </div>
            )}

            {/* Availability Section - New */}
            {(professional.availabilityStatus || professional.workingHours) && (
              <div className="p-8 rounded-[2rem] bg-surface-container-low border border-outline-variant/5 space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Availability & Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {professional.availabilityStatus && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Current Status</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
                        professional.availabilityStatus === 'Available' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        <Circle className="w-2 h-2 fill-current" />
                        {professional.availabilityStatus}
                      </div>
                    </div>
                  )}
                  {professional.workingHours && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Working Hours</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                        <Clock className="w-4 h-4 text-primary" />
                        {professional.workingHours}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">About</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                {professional.bio}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {professional.skills.map((skill, idx) => (
                  <span key={`${professional.id}-skill-${idx}`} className="px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Verification Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professional.verificationBadges.map((badge, idx) => (
                  <div key={`${professional.id}-badge-${idx}`} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                    <Award className="w-5 h-5 text-tertiary" />
                    <span className="text-xs font-bold tracking-tight">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Recent Reviews</h3>
              <div className="space-y-4">
                {professional.reviews.filter((r, i, s) => i === s.findIndex(t => t.id === r.id)).map((review) => (
                  <div key={review.id} className="p-6 rounded-[1.5rem] bg-surface-container-low border border-outline-variant/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm tracking-tight">{review.userName}</span>
                      <div className="flex items-center gap-1.5 text-tertiary">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium italic leading-relaxed">"{review.comment}"</p>
                    <p className="text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-widest">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
