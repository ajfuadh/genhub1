import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { LogOut, User, Menu, X, ChevronRight, Sparkles, Shield } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

interface NavbarProps {
  onBecomePro: () => void;
  isProfessional?: boolean;
  onSwitchView?: () => void;
  hasOnboarded?: boolean;
  onSwitchToPro?: () => void;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

// Animated nav link component
const NavLink = ({ 
  href, 
  children, 
  onClick,
  isActive = false,
  badge
}: { 
  href?: string; 
  children: React.ReactNode; 
  onClick?: () => void;
  isActive?: boolean;
  badge?: string;
}) => (
  <motion.a 
    href={href}
    onClick={onClick}
    className="relative group cursor-pointer flex items-center gap-2"
    whileHover={{ y: -1 }}
  >
    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
      isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
    }`}>
      {children}
    </span>
    {badge && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[7px] font-black uppercase tracking-widest"
      >
        {badge}
      </motion.span>
    )}
    <motion.span 
      className="absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full"
      initial={{ width: 0 }}
      whileHover={{ width: '100%' }}
      transition={{ duration: 0.3 }}
    />
  </motion.a>
);

// Animated button component  
const AnimatedButton = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = ""
}: { 
  onClick?: () => void; 
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  className?: string;
}) => {
  const variants = {
    primary: "bg-primary text-surface shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
    ghost: "bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 hover:border-primary/30",
    danger: "bg-error/10 text-error hover:bg-error/20"
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden px-4 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all duration-300 ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ 
  onBecomePro, 
  isProfessional, 
  onSwitchView, 
  hasOnboarded, 
  onSwitchToPro,
  approvalStatus 
}) => {
  const [user] = useAuthState(auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Track scroll position for navbar style changes
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleLogout = () => {
    auth.signOut();
  };

  // Logo animation variants
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-surface/90 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="branded-container flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="flex items-center gap-3"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.span 
                className="text-xl font-black tracking-tighter text-primary font-headline cursor-pointer"
                animate={{ 
                  textShadow: isScrolled 
                    ? '0 0 20px rgba(6, 214, 160, 0.3)' 
                    : '0 0 0px rgba(6, 214, 160, 0)'
                }}
              >
                GenHub
              </motion.span>
              <motion.span 
                className="absolute -top-1 -right-2 text-[8px] font-bold text-secondary"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                .
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            {!isProfessional ? (
              <>
                <NavLink href="#services">Services</NavLink>
                <NavLink href="#security">Security</NavLink>
                {hasOnboarded ? (
                  <NavLink 
                    onClick={onSwitchToPro}
                    badge={approvalStatus === 'pending' ? 'Pending' : undefined}
                  >
                    Dashboard
                  </NavLink>
                ) : (
                  <NavLink onClick={onBecomePro}>
                    <span className="flex items-center gap-1">
                      Become a Pro
                      <Sparkles className="w-3 h-3 text-secondary" />
                    </span>
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-on-surface-variant"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${
                      approvalStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {approvalStatus === 'approved' ? 'Pro Mode' : 'Pending Review'}
                  </span>
                </motion.div>
                <NavLink onClick={onSwitchView}>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Switch to Customer
                  </span>
                </NavLink>
              </>
            )}
            <NavLink href="#about">About</NavLink>
            
            {/* User Info & Logout */}
            {user && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 pl-6 border-l border-white/10"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                      {user.displayName || user.phoneNumber || 'User'}
                    </span>
                    <span className="text-[8px] text-on-surface-variant font-medium lowercase tracking-widest">
                      {user.email || 'Verified Partner'}
                    </span>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 10 }}
                    className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"
                  >
                    <User className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
                
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block"
          >
            <AnimatedButton 
              onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              variant="primary"
            >
              WhatsApp Support
            </AnimatedButton>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-5 h-5 text-on-surface" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <Menu className="w-5 h-5 text-on-surface" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-surface-container/95 backdrop-blur-2xl border-t border-white/5 overflow-hidden"
            >
              <div className="branded-container py-6 space-y-4">
                {!isProfessional ? (
                  <>
                    <MobileNavLink href="#services" onClick={() => setIsMobileMenuOpen(false)}>
                      Services
                    </MobileNavLink>
                    <MobileNavLink href="#security" onClick={() => setIsMobileMenuOpen(false)}>
                      Security
                    </MobileNavLink>
                    {hasOnboarded ? (
                      <MobileNavLink 
                        onClick={() => { onSwitchToPro?.(); setIsMobileMenuOpen(false); }}
                        badge={approvalStatus === 'pending' ? 'Pending' : undefined}
                      >
                        Dashboard
                      </MobileNavLink>
                    ) : (
                      <MobileNavLink onClick={() => { onBecomePro(); setIsMobileMenuOpen(false); }}>
                        Become a Pro
                      </MobileNavLink>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5">
                      <div className={`w-2 h-2 rounded-full ${
                        approvalStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs font-bold text-on-surface-variant">
                        {approvalStatus === 'approved' ? 'Pro Mode Active' : 'Pending Review'}
                      </span>
                    </div>
                    <MobileNavLink onClick={() => { onSwitchView?.(); setIsMobileMenuOpen(false); }}>
                      Switch to Customer
                    </MobileNavLink>
                  </>
                )}
                <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </MobileNavLink>

                {user && (
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-3 px-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">
                          {user.displayName || user.phoneNumber || 'User'}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {user.email || 'Verified Partner'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={handleLogout}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-error/10 text-error"
                    >
                      <span className="text-sm font-bold">Logout</span>
                      <LogOut className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}

                <motion.a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="block w-full px-4 py-4 rounded-xl bg-primary text-surface text-center font-bold text-sm shadow-lg shadow-primary/20"
                >
                  WhatsApp Support
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

// Mobile nav link component
const MobileNavLink = ({ 
  href, 
  children, 
  onClick,
  badge
}: { 
  href?: string; 
  children: React.ReactNode; 
  onClick?: () => void;
  badge?: string;
}) => (
  <motion.a 
    href={href}
    onClick={onClick}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
  >
    <span className="text-sm font-bold text-on-surface flex items-center gap-2">
      {children}
      {badge && (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase">
          {badge}
        </span>
      )}
    </span>
    <ChevronRight className="w-4 h-4 text-on-surface-variant" />
  </motion.a>
);
