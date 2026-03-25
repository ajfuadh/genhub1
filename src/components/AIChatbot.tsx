import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-msg', role: 'model', text: 'Hello! I am GenHub AI. How can I help you today with our verified services?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are GenHub AI, a helpful assistant for GenHub, a platform for secure, verified services. You help users understand how GenHub works, our verification process (12-point AI verification, background checks, biometric scans), and the services we offer (Cleaning, Plumbing, Electrical, Security, etc.). Be professional, trustworthy, and concise. Users can book professionals, pay securely (full or advance), and chat with them after booking. Professionals can also onboard via a strict verification protocol. If you don't know something specific about a user's order, tell them to contact support via the WhatsApp link in the navbar.",
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      
      const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsgId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setMessages(prev => [...prev, { id: errorMsgId, role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-card rounded-3xl border border-primary/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">GenHub AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-on-primary rounded-tr-none' 
                      : 'bg-surface-container-high text-on-surface rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-high p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-outline-variant/10 bg-surface-container-low">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-surface-container-high border border-outline-variant/20 rounded-2xl px-4 py-3 pr-12 text-sm focus:border-primary outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:brightness-110"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center hover:brightness-110 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
