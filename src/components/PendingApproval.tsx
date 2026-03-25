import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface PendingApprovalProps {
  onBackToCustomer: () => void;
}

export const PendingApproval: React.FC<PendingApprovalProps> = ({ onBackToCustomer }) => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass-card rounded-[3rem] border border-primary/20 p-12 text-center relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <Clock className="w-12 h-12 text-primary" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          />
        </div>

        <h1 className="text-4xl font-black font-headline tracking-tight mb-4">Application Pending.</h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto mb-10 opacity-70">
          Your professional profile is currently being reviewed by our security team. We verify every expert to ensure the highest standards of service.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <StatusStep icon={ShieldCheck} label="ID Verified" completed={true} />
          <StatusStep icon={CheckCircle2} label="Documents" completed={true} />
          <StatusStep icon={AlertCircle} label="Admin Review" completed={false} />
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-10 text-left">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">What happens next?</h3>
          <ul className="space-y-3">
            <li className="text-sm text-on-surface-variant flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Our team manually reviews your uploaded certifications and licenses.
            </li>
            <li className="text-sm text-on-surface-variant flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              You'll receive a notification via email and WhatsApp once approved.
            </li>
            <li className="text-sm text-on-surface-variant flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              Typically, reviews are completed within 24-48 business hours.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={onBackToCustomer}
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-container-high text-on-surface rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Customer View
          </button>
          
          {/* Simulation Button for Testing */}
          <button 
            onClick={async () => {
              const { auth, db } = await import('../firebase');
              const { updateDoc, doc } = await import('firebase/firestore');
              if (auth.currentUser) {
                await updateDoc(doc(db, 'users', auth.currentUser.uid), { approvalStatus: 'approved' });
                await updateDoc(doc(db, 'professionals', auth.currentUser.uid), { approvalStatus: 'approved' });
                window.location.reload();
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-on-primary-container rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
          >
            Simulate Admin Approval
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatusStep = ({ icon: Icon, label, completed }: { icon: any, label: string, completed: boolean }) => (
  <div className={`p-4 rounded-2xl border ${completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 opacity-50'}`}>
    <Icon className={`w-5 h-5 mx-auto mb-2 ${completed ? 'text-emerald-500' : 'text-on-surface-variant'}`} />
    <p className={`text-[10px] font-black uppercase tracking-widest ${completed ? 'text-emerald-500' : 'text-on-surface-variant'}`}>
      {label}
    </p>
  </div>
);
