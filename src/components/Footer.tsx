import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/5 py-16">
      <div className="branded-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="space-y-6">
            <div className="text-xl font-bold tracking-tighter text-primary font-headline">GenHub.</div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              The world's most secure service ecosystem. AI-driven trust for the modern world.
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-bold mb-8 text-on-surface uppercase tracking-[0.2em]">Services</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Healthcare</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Plumbing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Electrician</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-bold mb-8 text-on-surface uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security Whitepaper</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-bold mb-8 text-on-surface uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">
          <p>© 2026 GenHub Technologies Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-on-surface transition-colors">Twitter</a>
            <a href="#" className="hover:text-on-surface transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-on-surface transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
