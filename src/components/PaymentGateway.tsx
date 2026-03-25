import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, Loader2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Professional } from '../types';

interface PaymentGatewayProps {
  professional: Professional;
  onSuccess: (transactionId: string, mode: 'full' | 'advance') => void;
  onClose: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ professional, onSuccess, onClose }) => {
  const [paymentMode, setPaymentMode] = useState<'full' | 'advance'>('full');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');

  const amountToPay = paymentMode === 'full' ? professional.pricePerHour : 100;
  const remainingAmount = professional.pricePerHour - 100;

  const validateCard = () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      return "Please enter a valid card number (13-19 digits).";
    }
    
    if (!/^\d{2}\s\/\s\d{2}$/.test(expiry)) {
      return "Expiry date must be in MM / YY format.";
    }

    const [month, year] = expiry.split('/').map(n => parseInt(n.trim()));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) {
      return "Invalid month in expiry date.";
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "This card has expired. Please use a different card.";
    }

    if (cvv.length < 3) {
      return "CVV must be at least 3 digits.";
    }

    return null;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)} / ${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          paymentMode,
          cardNumber: cardNumber.replace(/\s/g, ''),
          professionalId: professional.id
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.transactionId, paymentMode);
      } else {
        setError(data.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    // Simple card type detection
    if (v.startsWith('4')) setCardType('visa');
    else if (v.startsWith('5')) setCardType('mastercard');
    else if (v.startsWith('3')) setCardType('amex');
    else setCardType('unknown');

    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.slice(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6 bg-surface/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-card rounded-3xl border border-primary/20 shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-primary/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">VaultPay Secure</h2>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">End-to-End Encrypted</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePayment} className="p-8 space-y-6">
          {/* Payment Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMode('full')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMode === 'full' 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-white/5 bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Pay Now</p>
              <p className="font-bold text-sm">Full Amount</p>
              <p className="text-xs text-primary font-bold mt-1">₹{professional.pricePerHour}</p>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('advance')}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                paymentMode === 'advance' 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-white/5 bg-surface-container-low hover:bg-surface-container-high'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">COD + Prepay</p>
              <p className="font-bold text-sm">Pay Advance</p>
              <p className="text-xs text-primary font-bold mt-1">₹100</p>
            </button>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={professional.imageUrl} 
                alt={professional.name} 
                className="w-10 h-10 rounded-lg object-cover border border-primary/10"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs text-on-surface-variant font-medium">
                  {paymentMode === 'full' ? 'Full Payment' : 'Advance Payment'}
                </p>
                <p className="font-bold">₹{amountToPay}</p>
              </div>
            </div>
            {paymentMode === 'advance' && (
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Due at Delivery</p>
                <p className="text-xs font-bold text-amber-400">₹{remainingAmount}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className={`w-full bg-surface-container-highest border rounded-xl py-3 pl-12 pr-12 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                    error && (cardNumber.replace(/\s/g, '').length < 13) ? 'border-destructive/50' : 'border-white/5'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {cardType === 'visa' && <span className="text-[10px] font-black italic text-blue-500">VISA</span>}
                  {cardType === 'mastercard' && <span className="text-[10px] font-black italic text-orange-500">MC</span>}
                  {cardType === 'amex' && <span className="text-[10px] font-black italic text-cyan-500">AMEX</span>}
                  <Lock className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</label>
                <input 
                  type="text"
                  required
                  maxLength={7}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  className={`w-full bg-surface-container-highest border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                    error && !/^\d{2}\s\/\s\d{2}$/.test(expiry) ? 'border-destructive/50' : 'border-white/5'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">CVV</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input 
                    type="password"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="***"
                    className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-destructive">Payment Error</p>
                  <p className="text-[11px] text-destructive/80 leading-tight">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-primary text-on-primary-container rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Securely...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ₹{professional.pricePerHour} Now
              </>
            )}
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                PCI-DSS Compliant
              </div>
              <div className="w-px h-3 bg-outline-variant/20" />
              <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                256-bit SSL
              </div>
            </div>
            <p className="text-[9px] text-on-surface-variant/60 text-center max-w-[80%] leading-tight">
              Your payment information is processed securely. We do not store your full card details on our servers.
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
