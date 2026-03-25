import React from 'react';
import { auth } from '../firebase';
import { LogOut, User } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

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
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-2xl border-b border-outline-variant/5">
      <div className="branded-container flex justify-between items-center py-3">
        <div className="text-lg font-bold tracking-tighter text-primary font-headline">GenHub.</div>
        <div className="hidden md:flex items-center space-x-8 text-[9px] font-bold uppercase tracking-[0.15em]">
          {!isProfessional ? (
            <>
              <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Services</a>
              <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">Security</a>
              {hasOnboarded ? (
                <button 
                  onClick={onSwitchToPro}
                  className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  Dashboard
                  {approvalStatus === 'pending' && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[7px] font-black uppercase tracking-widest">
                      Pending
                    </span>
                  )}
                </button>
              ) : (
                <button 
                  onClick={onBecomePro}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Become a Pro
                </button>
              )}
            </>
          ) : (
            <>
              <span className="text-on-surface-variant flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full animate-pulse ${approvalStatus === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} /> 
                {approvalStatus === 'approved' ? 'Pro Mode' : 'Pending Review'}
              </span>
              <button 
                onClick={onSwitchView}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Switch to Customer
              </button>
            </>
          )}
          <a className="text-on-surface-variant hover:text-on-surface transition-colors" href="#">About</a>
          
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/10">
              <div className="flex flex-col items-end">
                <span className="text-on-surface font-bold normal-case tracking-tight text-[11px]">{user.displayName || user.phoneNumber || 'User'}</span>
                <span className="text-[7px] text-on-surface-variant font-medium lowercase tracking-widest">{user.email || 'Verified Partner'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <div>
          <a 
            href="https://wa.me/919876543210"
            className="bg-primary text-on-primary-container px-4 py-2 rounded-xl font-bold text-[8px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </nav>
  );
};
