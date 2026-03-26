import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { LogOut, User, Menu, X, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onBecomePro: () => void;
  isProfessional?: boolean;
  onSwitchView?: () => void;
  hasOnboarded?: boolean;
  onSwitchToPro?: () => void;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const navLinks = !isProfessional ? [
    { label: 'Services', href: '#expert-network' },
    { label: 'Security', href: '#security' },
    { label: 'About', href: '#about' },
  ] : [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Analytics', href: '#analytics' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2' 
            : 'py-4'
        }`}
        style={{
          background: isScrolled 
            ? 'rgba(10, 10, 10, 0.9)' 
            : 'rgba(10, 10, 10, 0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled 
            ? '1px solid rgba(0, 245, 255, 0.1)' 
            : '1px solid transparent',
          boxShadow: isScrolled 
            ? '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 245, 255, 0.05)' 
            : 'none'
        }}
      >
        <div className="branded-container flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <span 
              className="text-2xl font-black tracking-tighter font-headline cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: 'none'
              }}
            >
              GenHub
            </span>
            <span 
              className="text-2xl font-black font-headline"
              style={{ color: '#00F5FF' }}
            >.</span>
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, #00F5FF, #8A2BE2)' }}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors group"
              >
                {link.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-px bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}

            {/* Conditional Pro/Dashboard Button */}
            {!isProfessional && (
              hasOnboarded ? (
                <motion.button 
                  onClick={onSwitchToPro}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Dashboard
                  {approvalStatus === 'pending' && (
                    <span 
                      className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
                      style={{
                        background: 'rgba(255, 170, 0, 0.1)',
                        color: '#ffaa00',
                        border: '1px solid rgba(255, 170, 0, 0.3)'
                      }}
                    >
                      Pending
                    </span>
                  )}
                </motion.button>
              ) : (
                <motion.button 
                  onClick={onBecomePro}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Become a Pro
                </motion.button>
              )
            )}

            {isProfessional && (
              <>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${approvalStatus === 'approved' ? 'bg-success' : 'bg-warning'}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ 
                      boxShadow: approvalStatus === 'approved' 
                        ? '0 0 10px #00ff88' 
                        : '0 0 10px #ffaa00' 
                    }}
                  />
                  {approvalStatus === 'approved' ? 'Pro Mode' : 'Pending Review'}
                </div>
                <motion.button 
                  onClick={onSwitchView}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors"
                >
                  Switch to Customer
                </motion.button>
              </>
            )}

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center gap-4 pl-6 ml-2 border-l border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl overflow-hidden"
                    style={{
                      border: '2px solid rgba(0, 245, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(0, 245, 255, 0.2)'
                    }}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] text-on-surface font-bold tracking-tight">
                      {user.displayName || user.phoneNumber || 'User'}
                    </span>
                    <span className="text-[9px] text-on-surface-variant font-medium">
                      {user.email || 'Verified Partner'}
                    </span>
                  </div>
                </div>
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-error hover:bg-error/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>

          {/* WhatsApp & Mobile Menu */}
          <div className="flex items-center gap-3">
            <motion.a 
              href="https://wa.me/919876543210"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
                border: '1px solid rgba(0, 245, 255, 0.3)',
                color: '#00F5FF',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)'
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Support
            </motion.a>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-primary"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                border: '1px solid rgba(0, 245, 255, 0.2)'
              }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background: 'rgba(10, 10, 10, 0.98)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex flex-col h-full pt-24 px-6">
              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl text-lg font-bold text-on-surface hover:text-primary transition-all group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {link.label}
                    <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}

                {!isProfessional && (
                  <motion.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      hasOnboarded ? onSwitchToPro?.() : onBecomePro();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
                      border: '1px solid rgba(0, 245, 255, 0.3)',
                      color: '#00F5FF'
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      {hasOnboarded ? 'Go to Dashboard' : 'Become a Pro'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* User Info */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto mb-8 p-6 rounded-3xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(0, 245, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl overflow-hidden"
                      style={{
                        border: '2px solid rgba(0, 245, 255, 0.3)',
                        boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)'
                      }}
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-on-surface">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {user.email || user.phoneNumber || 'Verified'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                    style={{
                      background: 'rgba(255, 68, 68, 0.1)',
                      border: '1px solid rgba(255, 68, 68, 0.3)',
                      color: '#ff4444'
                    }}
                  >
                    Sign Out
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
