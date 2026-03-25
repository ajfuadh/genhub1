import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Fingerprint, 
  GraduationCap, 
  Phone, 
  MapPin, 
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Upload,
  Camera
} from 'lucide-react';

interface ProfessionalOnboardingProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

type Step = 'security-init' | 'verification' | 'success';
type VerificationStatus = 'Pending' | 'Verified' | 'Action Required';

export const ProfessionalOnboarding: React.FC<ProfessionalOnboardingProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('security-init');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    serviceType: '',
    kycId: '',
    degree: '',
  });

  const [statuses, setStatuses] = useState<Record<string, VerificationStatus>>({
    kyc: 'Action Required',
    fingerprint: 'Pending',
    degree: 'Action Required',
    face: 'Action Required',
  });

  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});

  const simulateVerification = (key: string) => {
    setIsVerifying(prev => ({ ...prev, [key]: true }));
    setStatuses(prev => ({ ...prev, [key]: 'Pending' }));
    
    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [key]: 'Verified' }));
      setIsVerifying(prev => ({ ...prev, [key]: false }));
    }, 2500);
  };

  const getStatusStyles = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified': return 'text-emerald-400 bg-emerald-400/10';
      case 'Action Required': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-on-surface-variant bg-surface-container-highest';
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'security-init') setStep('verification');
    else if (step === 'verification') {
      const allVerified = Object.values(statuses).every(s => s === 'Verified');
      if (allVerified) {
        setStep('success');
      } else {
        alert("Please complete all verification steps before submitting.");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-surface/95 backdrop-blur-2xl overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-card rounded-[2.5rem] border border-primary/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <div>
            <h2 className="text-2xl font-extrabold font-headline">Security & Verification</h2>
            <p className="text-on-surface-variant text-sm mt-1">GenHub Professional Trust Protocol v2.4</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface-container-highest w-full">
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 'security-init' ? '33%' : step === 'verification' ? '66%' : '100%' 
            }}
            className="h-full bg-primary"
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'security-init' && (
              <motion.form 
                key="security-init"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h3 className="font-black text-lg tracking-tight">Security Initialization</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    To maintain the highest safety standards on GenHub, all professionals must undergo a multi-layered security screening. This includes biometric verification and background checks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <UserCheck className="w-3 h-3" /> Full Legal Name
                    </label>
                    <input 
                      required
                      type="text"
                      placeholder="As per ID proof"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Secure Phone
                    </label>
                    <input 
                      required
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Service Area
                    </label>
                    <input 
                      required
                      type="text"
                      placeholder="City, Area"
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Professional Category
                    </label>
                    <select 
                      required
                      className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all appearance-none"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="security">Personal Security</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary-container rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Initialize Security Protocol <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === 'verification' && (
              <motion.form 
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* KYC Card */}
                  <div className={`bg-surface-container-low border rounded-2xl p-6 transition-all group ${statuses.kyc === 'Verified' ? 'border-emerald-500/20' : 'border-outline-variant/20 hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statuses.kyc === 'Verified' ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                        <UserCheck className={`w-5 h-5 ${statuses.kyc === 'Verified' ? 'text-emerald-500' : 'text-primary'}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${getStatusStyles(statuses.kyc)}`}>
                        {statuses.kyc}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">KYC Authentication</h3>
                    <p className="text-xs text-on-surface-variant mb-4">Upload Aadhaar, PAN, or Passport</p>
                    <button 
                      type="button" 
                      disabled={isVerifying.kyc || statuses.kyc === 'Verified'}
                      onClick={() => simulateVerification('kyc')}
                      className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        statuses.kyc === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                          : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {isVerifying.kyc ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : statuses.kyc === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                      {statuses.kyc === 'Verified' ? 'Verified' : isVerifying.kyc ? 'Verifying...' : 'Upload Document'}
                    </button>
                  </div>

                  {/* Fingerprint Card */}
                  <div className={`bg-surface-container-low border rounded-2xl p-6 transition-all group ${statuses.fingerprint === 'Verified' ? 'border-emerald-500/20' : 'border-outline-variant/20 hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statuses.fingerprint === 'Verified' ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                        <Fingerprint className={`w-5 h-5 ${statuses.fingerprint === 'Verified' ? 'text-emerald-500' : 'text-primary'}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${getStatusStyles(statuses.fingerprint)}`}>
                        {statuses.fingerprint}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">Fingerprint Scan</h3>
                    <p className="text-xs text-on-surface-variant mb-4">Visit nearest GenHub Center</p>
                    <button 
                      type="button" 
                      disabled={isVerifying.fingerprint || statuses.fingerprint === 'Verified'}
                      onClick={() => simulateVerification('fingerprint')}
                      className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        statuses.fingerprint === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                          : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {isVerifying.fingerprint ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : statuses.fingerprint === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {statuses.fingerprint === 'Verified' ? 'Verified' : isVerifying.fingerprint ? 'Verifying...' : 'Locate Center'}
                    </button>
                  </div>

                  {/* Degree Card */}
                  <div className={`bg-surface-container-low border rounded-2xl p-6 transition-all group ${statuses.degree === 'Verified' ? 'border-emerald-500/20' : 'border-outline-variant/20 hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statuses.degree === 'Verified' ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                        <GraduationCap className={`w-5 h-5 ${statuses.degree === 'Verified' ? 'text-emerald-500' : 'text-primary'}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${getStatusStyles(statuses.degree)}`}>
                        {statuses.degree}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">Degree Verification</h3>
                    <p className="text-xs text-on-surface-variant mb-4">Certificates & Licenses</p>
                    <button 
                      type="button" 
                      disabled={isVerifying.degree || statuses.degree === 'Verified'}
                      onClick={() => simulateVerification('degree')}
                      className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        statuses.degree === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                          : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {isVerifying.degree ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : statuses.degree === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                      {statuses.degree === 'Verified' ? 'Verified' : isVerifying.degree ? 'Verifying...' : 'Upload Degree'}
                    </button>
                  </div>

                  {/* Live Photo Card */}
                  <div className={`bg-surface-container-low border rounded-2xl p-6 transition-all group ${statuses.face === 'Verified' ? 'border-emerald-500/20' : 'border-outline-variant/20 hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statuses.face === 'Verified' ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                        <Camera className={`w-5 h-5 ${statuses.face === 'Verified' ? 'text-emerald-500' : 'text-primary'}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${getStatusStyles(statuses.face)}`}>
                        {statuses.face}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm mb-1">Face Authentication</h3>
                    <p className="text-xs text-on-surface-variant mb-4">Real-time liveness check</p>
                    <button 
                      type="button" 
                      disabled={isVerifying.face || statuses.face === 'Verified'}
                      onClick={() => simulateVerification('face')}
                      className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        statuses.face === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                          : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                      }`}
                    >
                      {isVerifying.face ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : statuses.face === 'Verified' ? <CheckCircle2 className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      {statuses.face === 'Verified' ? 'Verified' : isVerifying.face ? 'Verifying...' : 'Start Camera'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep('security-init')}
                    className="flex-1 py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold hover:bg-surface-container-highest transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-primary text-on-primary-container rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Submit for Review <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-4 border-emerald-500/30"
                  />
                </div>
                <h3 className="text-3xl font-extrabold font-headline mb-4">Application Submitted!</h3>
                <p className="text-on-surface-variant max-w-md mx-auto mb-10">
                  Our security team will review your documents and biometric data. You will receive a notification on your registered phone number within 48 hours.
                </p>
                <button 
                  onClick={() => onComplete(formData)}
                  className="px-12 py-4 bg-primary text-on-primary-container rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
