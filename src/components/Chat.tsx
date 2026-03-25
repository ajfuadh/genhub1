import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ShieldCheck, Paperclip, Smile, Loader2, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Professional, Message } from '../types';
import { dataService } from '../services/dataService';
import { auth } from '../firebase';

interface ChatProps {
  bookingId: string;
  professional: Professional;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ bookingId, professional, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const unsubscribe = dataService.onBookingMessages(bookingId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
      
      // Mark messages as read when they arrive and chat is open
      if (auth.currentUser) {
        dataService.markMessagesAsRead(bookingId, auth.currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  // WebSocket for typing status
  useEffect(() => {
    if (!auth.currentUser) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'REGISTER',
        professionalId: auth.currentUser?.uid
      }));
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'TYPING_STATUS' && payload.data.bookingId === bookingId) {
          if (payload.data.senderId !== auth.currentUser?.uid) {
            setIsOtherTyping(payload.data.isTyping);
          }
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [bookingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socketRef.current?.readyState === WebSocket.OPEN && auth.currentUser) {
      // Send typing status
      socketRef.current.send(JSON.stringify({
        type: 'TYPING_STATUS',
        receiverId: professional.id,
        bookingId,
        isTyping: true
      }));

      // Clear existing timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Set timeout to stop typing status
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.send(JSON.stringify({
          type: 'TYPING_STATUS',
          receiverId: professional.id,
          bookingId,
          isTyping: false
        }));
      }, 2000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !auth.currentUser) return;

    const messageText = inputText;
    setInputText('');

    // Stop typing status immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current?.send(JSON.stringify({
      type: 'TYPING_STATUS',
      receiverId: professional.id,
      bookingId,
      isTyping: false
    }));

    try {
      await dataService.sendMessage({
        bookingId,
        senderId: auth.currentUser.uid,
        receiverId: professional.id,
        text: messageText,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[150] w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] glass-card rounded-3xl border border-primary/20 shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-primary/10 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={professional.imageUrl} 
              alt={professional.name} 
              className="w-10 h-10 rounded-full object-cover border border-primary/20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-sm">{professional.name}</h4>
              <ShieldCheck className="w-3 h-3 text-primary" />
            </div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
              {isOtherTyping ? 'Typing...' : `Online • ${professional.category}`}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-center py-4">
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Secure End-to-End Encrypted Chat
              </span>
            </div>
            
            <AnimatePresence initial={false}>
              {messages.filter((msg, index, self) => index === self.findIndex((t) => t.id === msg.id)).map((msg) => {
                const isMe = msg.senderId === auth.currentUser?.uid;
                return (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, scale: 0.8, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm relative shadow-sm transition-all ${
                      isMe 
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-on-primary-container rounded-tr-none' 
                        : 'bg-surface-container-highest text-on-surface rounded-tl-none border border-white/5'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-tighter opacity-60 ${isMe ? 'text-on-primary-container/70' : 'text-on-surface-variant'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        {isMe && (
                          <div className="flex items-center">
                            {msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-emerald-300 drop-shadow-sm" />
                            ) : (
                              <Check className="w-3 h-3 text-on-primary-container/40" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isOtherTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-container-highest text-on-surface p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-on-surface-variant rounded-full" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-surface-container-low border-t border-white/10">
        <div className="flex items-center gap-2 bg-surface-container-highest rounded-2xl p-2 border border-white/5">
          <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
          />
          <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-primary text-on-primary-container rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
