import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (role: 'customer' | 'expert') => void;
}

// Animated background orb
const AnimatedOrb = ({ 
  className, 
  delay = 0 
}: { 
  className: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.3, 1],
      x: [0, 50, -30, 0],
      y: [0, -30, 40, 0],
    }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={className}
  />
);

// Floating geometric shapes
const FloatingShape = ({ delay, type }: { delay: number; type: 'circle' | 'square' | 'triangle' }) => {
  const shapes = {
    circle: "w-3 h-3 rounded-full",
    square: "w-3 h-3 rounded-sm rotate-45",
    triangle: "w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        y: [-20, -300],
        x: [0, Math.random() * 60 - 30],
        rotate: [0, 360]
      }}
      transition={{ 
        duration: 6 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: "easeOut"
      }}
      className={`absolute ${shapes[type]} ${type !== 'triangle' ? 'bg-primary/20' : ''}`}
      style={{ 
        left: `${Math.random() * 100}%`,
        bottom: '0%'
      }}
    />
  );
};

// 3D Card with tilt effect
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  
  const springConfig = { stiffness: 400, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  return (
    <motion.div
      style={{ 
        rotateX: rotateXSpring, 
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated button component
const AnimatedButton = ({ 
  onClick, 
  disabled, 
  children, 
  variant = 'primary',
  className = ""
}: { 
  onClick?: () => void; 
  disabled?: boolean; 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
}) => {
  const variants = {
    primary: "bg-primary text-surface hover:shadow-lg hover:shadow-primary/30",
    secondary: "bg-secondary text-surface hover:shadow-lg hover:shadow-secondary/30",
    glass: "bg-surface-container-high/80 border border-white/10 text-on-surface hover:bg-surface-container-highest hover:border-primary/30"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative overflow-hidden transition-all duration-300 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'expert-verification' | 'method' | 'phone' | 'otp'>('role');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'expert' | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (step === 'phone' && recaptchaRef.current && !window.recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => console.log('reCAPTCHA expired')
        });
        window.recaptchaVerifier = verifier;
      } catch (err) {
        console.error('Error initializing RecaptchaVerifier:', err);
      }
    }

    return () => {
      if (step !== 'phone' && window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, [step]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!auth || !googleProvider) throw new Error('Firebase Auth not initialized correctly');
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
      if (!window.recaptchaVerifier && recaptchaRef.current) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, { size: 'invisible' });
      }

      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) throw new Error('reCAPTCHA not initialized. Please try again.');
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP Error:', err);
      setError(err.message || 'Failed to send OTP. Please check the phone number format.');
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
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

  const stepVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        {/* Aurora effect */}
        <div className="absolute inset-0 aurora-bg opacity-40" />
        
        {/* Animated orbs */}
        <AnimatedOrb 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/15 blur-[150px] rounded-full" 
          delay={0}
        />
        <AnimatedOrb 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/15 blur-[130px] rounded-full" 
          delay={3}
        />
        <AnimatedOrb 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-tertiary/10 blur-[100px] rounded-full" 
          delay={5}
        />

        {/* Floating shapes */}
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingShape 
            key={i} 
            delay={i * 0.5} 
            type={['circle', 'square', 'triangle'][i % 3] as 'circle' | 'square' | 'triangle'} 
          />
        ))}

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Mouse follower */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px] pointer-events-none -z-10"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Main Login Card */}
      <TiltCard className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative backdrop-blur-2xl"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-10"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  selectedRole === 'expert' 
                    ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                <motion.div
                  animate={{ rotate: step === 'role' ? [0, 360] : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {selectedRole === 'expert' ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                </motion.div>
              </motion.div>
              
              <motion.h1 
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold font-headline tracking-tight mb-2 text-on-surface"
              >
                {step === 'role' ? 'Welcome to GenHub' : selectedRole === 'expert' ? 'Expert Portal' : 'Customer Access'}
              </motion.h1>
              <p className="text-sm text-on-surface-variant font-medium">
                {step === 'role' ? 'Choose your path to continue' : selectedRole === 'expert' ? 'Secure login for professionals' : 'Secure login for services'}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Role Selection */}
              {step === 'role' && (
                <motion.div 
                  key="role"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Customer Button */}
                  <motion.button 
                    onClick={() => { setSelectedRole('customer'); setStep('method'); }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group relative p-6 rounded-2xl bg-surface-container-high/80 border border-white/5 hover:border-primary/30 transition-all text-left overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative flex items-center gap-5">
                      <motion.div 
                        whileHover={{ rotate: 10 }}
                        className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
                      >
                        <User className="w-7 h-7" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg tracking-tight text-on-surface">Customer Portal</h3>
                        <p className="text-xs text-on-surface-variant font-medium">Book verified experts for your home</p>
                      </div>
                    </div>
                    <motion.div 
                      className="absolute right-6 top-1/2 -translate-y-1/2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                    </motion.div>
                  </motion.button>

                  {/* Expert Button */}
                  <motion.button 
                    onClick={() => { setSelectedRole('expert'); setStep('expert-verification'); }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group relative p-6 rounded-2xl bg-surface-container-high/80 border border-white/5 hover:border-secondary/30 transition-all text-left overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative flex items-center gap-5">
                      <motion.div 
                        whileHover={{ rotate: -10 }}
                        className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary"
                      >
                        <ShieldCheck className="w-7 h-7" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg tracking-tight text-on-surface">Expert Portal</h3>
                        <p className="text-xs text-on-surface-variant font-medium">Manage your jobs and earnings</p>
                      </div>
                    </div>
                    <motion.div 
                      className="absolute right-6 top-1/2 -translate-y-1/2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}

              {/* Expert Verification Info */}
              {step === 'expert-verification' && (
                <motion.div 
                  key="expert-verification"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 space-y-4"
                  >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Verification Requirements
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Government ID Verification (KYC)',
                        'Professional Background Check',
                        'Skill Assessment & Certification',
                        'Valid Bank Account for Payouts'
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          <p className="text-xs text-on-surface-variant font-medium">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <p className="text-[10px] text-on-surface-variant font-medium text-center px-4 leading-relaxed">
                    By continuing, you acknowledge that you will need to complete these steps.
                  </p>

                  <AnimatedButton 
                    onClick={() => setStep('method')}
                    variant="secondary"
                    className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest"
                  >
                    I Understand, Continue
                  </AnimatedButton>

                  <button 
                    onClick={() => setStep('role')}
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    Back to Role Selection
                  </button>
                </motion.div>
              )}

              {/* Login Methods */}
              {step === 'method' && (
                <motion.div 
                  key="method"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Google Login */}
                  <motion.button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-high/80 border border-white/5 hover:border-primary/30 transition-all group ${loading ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-on-surface" />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-on-surface">Continue with Google</span>
                    </div>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-on-surface-variant" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                    )}
                  </motion.button>

                  {/* Phone Login */}
                  <motion.button 
                    onClick={() => setStep('phone')}
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-surface-container-high/80 border border-white/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-on-surface" />
                      </div>
                      <span className="font-bold text-sm tracking-tight text-on-surface">Phone OTP Verification</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </motion.button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                      <span className="bg-surface-container px-4 text-on-surface-variant">Support</span>
                    </div>
                  </div>

                  {/* WhatsApp Support */}
                  <motion.button 
                    onClick={handleWhatsAppSupport}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-all font-bold text-sm"
                  >
                    <MessageSquare className="w-5 h-5" />
                    WhatsApp Support
                  </motion.button>

                  <button 
                    onClick={() => setStep('role')}
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mt-4"
                  >
                    Back to Role Selection
                  </button>
                </motion.div>
              )}

              {/* Phone Number Input */}
              {step === 'phone' && (
                <motion.div 
                  key="phone"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Phone Number</label>
                      <motion.input 
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        whileFocus={{ scale: 1.01 }}
                        className={`w-full bg-surface-container-high/80 border border-white/10 rounded-2xl px-6 py-4 text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50`}
                      />
                    </div>
                    <div ref={recaptchaRef}></div>
                    <AnimatedButton 
                      disabled={loading || !phoneNumber}
                      variant={selectedRole === 'expert' ? 'secondary' : 'primary'}
                      className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Code"}
                    </AnimatedButton>
                  </form>
                  <button 
                    onClick={() => setStep('method')}
                    className={`w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors`}
                  >
                    Back to Methods
                  </button>
                </motion.div>
              )}

              {/* OTP Verification */}
              {step === 'otp' && (
                <motion.div 
                  key="otp"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-center mb-6"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">
                      Code sent to <span className="text-on-surface font-bold">{phoneNumber}</span>
                    </p>
                  </motion.div>
                  
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">6-Digit Code</label>
                      <motion.input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        required
                        whileFocus={{ scale: 1.01 }}
                        className={`w-full bg-surface-container-high/80 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl font-bold tracking-[0.5em] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30`}
                      />
                    </div>
                    <AnimatedButton 
                      disabled={loading || otp.length !== 6}
                      variant={selectedRole === 'expert' ? 'secondary' : 'primary'}
                      className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
                    </AnimatedButton>
                  </form>
                  
                  <button 
                    onClick={() => setStep('phone')}
                    className={`w-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors`}
                  >
                    Change Phone Number
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-6 p-4 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-error font-medium">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-error hover:text-error/80">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </TiltCard>

      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-1/4 left-[10%] hidden lg:block"
      >
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="glass-card p-5 rounded-2xl border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            <span className="text-xs font-bold text-on-surface">Secure Connection</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute bottom-1/4 right-[10%] hidden lg:block"
      >
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="glass-card p-5 rounded-2xl border border-secondary/20"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-on-surface">AI Verified</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
