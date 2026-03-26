import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Healthcare', href: '#' },
    { label: 'Plumbing', href: '#' },
    { label: 'Electrician', href: '#' },
    { label: 'Legal Services', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Security Whitepaper', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
  social: [
    { label: 'Twitter', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Discord', href: '#' },
  ]
};

export const Footer = () => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute bottom-0 left-0 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), rgba(138, 43, 226, 0.3), transparent)'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Top Section with CTA */}
      <div className="branded-container mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-[2.5rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)',
            border: '1px solid rgba(0, 245, 255, 0.15)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20" style={{
            background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)',
            filter: 'blur(60px)'
          }} />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <motion.h3 
                className="text-3xl lg:text-4xl font-black font-headline mb-4 tracking-tight"
              >
                <span className="text-white">Ready to Experience the </span>
                <span style={{
                  background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}>Future?</span>
              </motion.h3>
              <p className="text-on-surface-variant text-sm max-w-md">
                Join thousands of users who trust GenHub for secure, verified services.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)',
                boxShadow: '0 20px 60px rgba(0, 245, 255, 0.3)'
              }}
            >
              <Sparkles className="w-5 h-5" />
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="branded-container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span 
                className="text-3xl font-black tracking-tighter font-headline"
                style={{
                  background: 'linear-gradient(135deg, #00F5FF 0%, #8A2BE2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                GenHub
              </span>
              <span className="text-3xl font-black font-headline text-primary">.</span>
            </motion.div>
            
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
              The world&apos;s most secure service ecosystem. AI-driven trust for the modern world, 
              connecting verified professionals with customers seamlessly.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@genhub.io</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-[10px] font-black mb-6 text-primary uppercase tracking-[0.3em]">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="group flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black mb-6 text-secondary uppercase tracking-[0.3em]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="group flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black mb-6 text-tertiary uppercase tracking-[0.3em]">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="group flex items-center gap-2 text-sm text-on-surface-variant hover:text-tertiary transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <p className="text-[11px] text-on-surface-variant font-medium">
            &copy; 2026 GenHub Technologies Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {footerLinks.social.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Decorative Bottom Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-12 h-px w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.5), rgba(138, 43, 226, 0.5), rgba(255, 0, 255, 0.5), transparent)'
          }}
        />
      </div>
    </footer>
  );
};
