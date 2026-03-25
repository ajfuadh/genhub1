import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Clock, Calendar, MapPin, X, ShieldCheck, Navigation, Wallet, MessageSquare, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Professional } from '../types';

interface BookingConfirmationProps {
  professional: Professional;
  paymentMode: 'full' | 'advance';
  onClose: () => void;
  onChat: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ professional, paymentMode, onClose, onChat }) => {
  const [status, setStatus] = useState("Assigned");
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  const bookingId = useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);
  const remainingAmount = professional.pricePerHour - 100;

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      console.log('BookingConfirmation: Connecting to WS:', wsUrl);
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "STATUS_UPDATE") {
            setStatus(data.status);
            setLocation(data.location);
            setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      ws.onclose = (event) => {
        console.log(`BookingConfirmation: WS closed (code: ${event.code}). Reconnecting in 5s...`);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error("BookingConfirmation: WS error:", error);
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const handleWhatsAppShare = () => {
    const message = `*GenHub Booking Confirmation* 🛡️\n\n` +
      `*Booking ID:* #${bookingId}\n` +
      `*Expert:* ${professional.name}\n` +
      `*Service:* ${professional.category}\n` +
      `*Status:* ${status}\n` +
      `*Payment:* ${paymentMode === 'full' ? 'Full Paid' : 'Advance Paid (₹100)'}\n` +
      `${paymentMode === 'advance' ? `*Due on COD:* ₹${remainingAmount}\n` : ''}` +
      `*Expert Location:* ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}\n` +
      `*Last Update:* ${lastUpdate}\n\n` +
      `_Track your expert live on GenHub app._`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Completed": return "text-emerald-400";
      case "En Route": return "text-amber-400";
      case "Arrived": return "text-primary";
      default: return "text-on-surface-variant";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-surface/90 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-card rounded-3xl border border-primary/20 shadow-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
            <CheckCircle2 className="w-10 h-10 text-primary" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-primary/30"
            />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold font-headline mb-2">Booking Confirmed!</h2>
        <p className="text-on-surface-variant text-sm mb-6">Live tracking is now active for your security.</p>

        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 text-left space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={professional.imageUrl} 
              alt={professional.name} 
              className="w-12 h-12 rounded-lg object-cover border border-primary/10"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold text-sm">{professional.name}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${getStatusColor(status)}`}>
                  {status}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="h-px bg-outline-variant/10" />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-on-surface-variant">Payment Status:</span>
              <div className="ml-auto text-right">
                <span className="font-bold block">
                  {paymentMode === 'full' ? 'Full Paid' : 'Advance Paid'}
                </span>
                {paymentMode === 'advance' && (
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                    ₹{remainingAmount} Due on COD
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-on-surface-variant">Live Location:</span>
              <span className="font-mono text-[10px] font-bold ml-auto">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-on-surface-variant">Last Update:</span>
              <span className="font-bold ml-auto">{lastUpdate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-on-surface-variant">Booking ID:</span>
              <span className="font-bold ml-auto">#{bookingId}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleWhatsAppShare}
          className="w-full mb-4 py-4 bg-[#25D366] text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3"
        >
          <Share2 className="w-5 h-5" />
          Send Confirmation to WhatsApp
        </button>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button 
            onClick={onChat}
            className="py-4 bg-tertiary text-on-tertiary rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
          >
            Chat Now
          </button>
          <button 
            onClick={onClose}
            className="py-4 bg-primary text-on-primary-container rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
          >
            Track Pro
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    </motion.div>
  );
};
