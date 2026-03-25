import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { 
  Mail, 
  Phone, 
  User,
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (role: 'customer' | 'expert') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'expert-verification' | 'method' | 'phone' | 'otp'>('role');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'expert' | null>(null);
  const recaptchaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 'phone' && recaptchaRef.current && !window.recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          }
        });
        window.recaptchaVerifier = verifier;
      } catch (err) {
        console.error('Error initializing RecaptchaVerifier:', err);
      }
    }

    return () => {
      if (step !== 'phone' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, [step]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase Auth not initialized correctly');
      }
      await signInWithPopup(auth, googleProvider);
      if (selectedRole) onLoginSuccess(selectedRole);
    } catch (err: any) {
      console.error('Google Login Error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/user-cancelled') {
        setError('Login cancelled. Please keep the popup open to sign in.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoading(true);
    setError(null);
    try {
      // Ensure verifier is initialized if it somehow wasn't
      if (!window.recaptchaVerifier && recaptchaRef.current) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: 'invisible'
        });
      }

      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized. Please try again.');
      }
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      setError(err.message || 'Failed to send OTP. Please check the phone number format (e.g., +919876543210).');
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = null;
        // Trigger a re-render to re-initialize recaptcha
        setStep('method');
        setTimeout(() => setStep('phone'), 100);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !verificationId) return;

    setLoading(true);
    setError(null);
    try {
      await verificationId.confirm(otp);
      if (selectedRole) onLoginSuccess(selectedRole);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent("Hi GenHub Support, I need help with logging in.");
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative"
      >
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${selectedRole === 'expert' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} mb-6`}>
            {selectedRole === 'expert' ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold font-headline tracking-tight mb-2">
            {step === 'role' ? 'Welcome to GenHub.' : selectedRole === 'expert' ? 'Expert Portal.' : 'Customer Access.'}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            {step === 'role' ? 'Choose your path to continue.' : selectedRole === 'expert' ? 'Secure login for verified professionals.' : 'Secure login for booking services.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div 
              key="role"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <button 
                onClick={() => {
                  setSelectedRole('customer');
                  setStep('method');
                }}
                className="w-full group relative p-6 rounded-[2rem] bg-surface-container-high border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-highest transition-all text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">Customer Portal</h3>
                    <p className="text-xs text-on-surface-variant font-bold">Book verified experts for your home</p>
                  </div>
                </div>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-hover:text-primary transition-all" />
              </button>

              <button 
                onClick={() => {
                  setSelectedRole('expert');
                  setStep('expert-verification');
                }}
                className="w-full group relative p-6 rounded-[2rem] bg-surface-container-high border border-outline-variant/10 hover:border-primary/30 hover:bg-surface-container-highest transition-all text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">Expert Portal</h3>
                    <p className="text-xs text-on-surface-variant font-bold">Manage your jobs, earnings, and profile</p>
                  </div>
                </div>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-all" />
              </button>
            </motion.div>
          )}

          {step === 'expert-verification' && (
            <motion.div 
              key="expert-verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-secondary/5 border border-secondary/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Verification Requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs text-on-surface-variant font-medium">Government ID Verification (KYC)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs text-on-surface-variant font-medium">Professional Background Check</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs text-on-surface-variant font-medium">Skill Assessment & Certification</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs text-on-surface-variant font-medium">Valid Bank Account for Payouts</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-on-surface-variant font-bold text-center px-4 leading-relaxed">
                By continuing, you acknowledge that you will need to complete these steps to be listed on GenHub.
              </p>

              <button 
                onClick={() => setStep('method')}
                className="w-full py-4 bg-secondary text-on-secondary-container rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                I Understand, Continue to Login
              </button>

              <button 
                onClick={() => setStep('role')}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-all"
              >
                Back to Role Selection
              </button>
            </motion.div>
          )}

          {step === 'method' && (
            <motion.div 
              key="method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-high border border-outline-variant/10 ${selectedRole === 'expert' ? 'hover:border-secondary/30' : 'hover:border-primary/30'} hover:bg-surface-container-highest transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Continue with Google</span>
                </div>
                <ArrowRight className={`w-4 h-4 text-on-surface-variant ${selectedRole === 'expert' ? 'group-hover:text-secondary' : 'group-hover:text-primary'} transition-all`} />
              </button>

              <button 
                onClick={() => setStep('phone')}
                disabled={loading}
                className={`w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-high border border-outline-variant/10 ${selectedRole === 'expert' ? 'hover:border-secondary/30' : 'hover:border-primary/30'} hover:bg-surface-container-highest transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-on-surface">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">Phone OTP Verification</span>
                </div>
                <ArrowRight className={`w-4 h-4 text-on-surface-variant ${selectedRole === 'expert' ? 'group-hover:text-secondary' : 'group-hover:text-primary'} transition-all`} />
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                  <span className="bg-surface px-4 text-on-surface-variant">Support</span>
                </div>
              </div>

              <button 
                onClick={handleWhatsAppSupport}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all font-bold text-sm"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp Integration
              </button>

              <button 
                onClick={() => setStep('role')}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all mt-4"
              >
                Back to Role Selection
              </button>
            </motion.div>
          )}

          {step === 'phone' && (
            <motion.div 
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Phone Number</label>
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className={`w-full bg-surface-container-high border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm focus:outline-none ${selectedRole === 'expert' ? 'focus:border-secondary' : 'focus:border-primary'} transition-all`}
                  />
                </div>
                <div ref={recaptchaRef}></div>
                <button 
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className={`w-full py-4 ${selectedRole === 'expert' ? 'bg-secondary text-on-secondary-container' : 'bg-primary text-on-primary-container'} rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Code"}
                </button>
              </form>
              <button 
                onClick={() => setStep('method')}
                className={`w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${selectedRole === 'expert' ? 'hover:text-secondary' : 'hover:text-primary'} transition-all`}
              >
                Back to Methods
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm text-on-surface-variant font-medium">Code sent to <span className="text-on-surface font-bold">{phoneNumber}</span></p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">6-Digit Code</label>
                  <input 
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className={`w-full bg-surface-container-high border border-outline-variant/20 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none ${selectedRole === 'expert' ? 'focus:border-secondary' : 'focus:border-primary'} transition-all`}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className={`w-full py-4 ${selectedRole === 'expert' ? 'bg-secondary text-on-secondary-container' : 'bg-primary text-on-primary-container'} rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
                </button>
              </form>
              <button 
                onClick={() => setStep('phone')}
                className={`w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${selectedRole === 'expert' ? 'hover:text-secondary' : 'hover:text-primary'} transition-all`}
              >
                Change Phone Number
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-3 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-error" />
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div className="flex-1 pr-6">
                <p className="text-xs text-error font-bold leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-error/10 text-error/60 hover:text-error transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
