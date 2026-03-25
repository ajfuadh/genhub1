import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Services } from './components/Services';
import { Security } from './components/Security';
import { Footer } from './components/Footer';
import { ProfessionalList } from './components/ProfessionalList';
import { ProfessionalProfile } from './components/ProfessionalProfile';
import { BookingConfirmation } from './components/BookingConfirmation';
import { PaymentGateway } from './components/PaymentGateway';
import { Chat } from './components/Chat';
import { ProfessionalOnboarding } from './components/ProfessionalOnboarding';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { NotificationManager } from './components/NotificationManager';
import { AIChatbot } from './components/AIChatbot';
import { Login } from './components/Login';
import { PendingApproval } from './components/PendingApproval';
import { mockProfessionals } from './mockData';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { dataService } from './services/dataService';
import { UserProfile, Professional, Booking } from './types';
import { getDocFromServer, doc } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [user, loading, authError] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Professional | null>(null);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'full' | 'advance'>('full');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (user) {
      const initApp = async () => {
        // 1. Initialize User Profile
        let profile = await dataService.getUserProfile(user.uid);
        if (!profile) {
          profile = {
            uid: user.uid,
            email: user.email || null,
            phoneNumber: user.phoneNumber || null,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          await dataService.saveUserProfile(profile);
        }
        
        const isPro = profile.role === 'professional';
        if (isPro) {
          setIsProfessional(true);
          setHasOnboarded(true);
        } else {
          setHasOnboarded(false);
          // If they chose expert at login, keep isProfessional true and start onboarding
          if (isProfessional) {
            setIsOnboarding(true);
          }
        }
        setUserProfile(profile);

        // 2. Fetch Professionals and Seed if needed
        // seedProfessionals only seeds if the collection is empty
        await dataService.seedProfessionals(mockProfessionals);
        const pros = await dataService.getProfessionals();
        // Ensure unique IDs for professionals
        const uniquePros = pros.filter((p, i, s) => i === s.findIndex(t => t.id === p.id));
        setProfessionals(uniquePros);
      };
      initApp();
    } else {
      setProfessionals([]);
      setUserProfile(null);
      setIsProfessional(false);
      setHasOnboarded(false);
      setIsOnboarding(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(role) => {
      if (role === 'expert') {
        setIsProfessional(true);
      }
    }} />;
  }

  const filteredProfessionals = selectedCategory 
    ? professionals
        .filter(p => p.category === selectedCategory)
        .sort((a, b) => b.rating - a.rating)
    : [];

  const handleBookingStart = () => {
    setIsPaying(true);
  };

  const handlePaymentSuccess = async (transactionId: string, mode: 'full' | 'advance') => {
    if (selectedProfessional && user) {
      const booking: Omit<Booking, 'id'> = {
        customerId: user.uid,
        professionalId: selectedProfessional.id,
        service: selectedProfessional.category,
        date: new Date().toLocaleDateString(),
        time: 'TBD',
        status: 'Confirmed',
        amount: selectedProfessional.pricePerHour,
        paymentMode: mode,
        createdAt: new Date().toISOString()
      };
      
      const bookingId = await dataService.createBooking(booking);
      setLastBookingId(bookingId);
      setConfirmedBooking(selectedProfessional);
      setPaymentMode(mode);
      setIsPaying(false);
      setSelectedProfessional(null);
      setSelectedCategory(null);
      console.log(`Payment successful: ${transactionId} via ${mode}`);
    }
  };

  const handleOnboardingComplete = async (proData: any) => {
    if (user) {
      // Ensure we don't accidentally spread an event object if proData is not what we expect
      const name = proData?.fullName || user.displayName || 'Verified Expert';
      const category = proData?.serviceType || 'General';
      
      const newPro: Professional = {
        id: user.uid,
        name: name,
        title: `Master ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        category: category,
        experience: '5+ Years (Verified)',
        bio: `Professional ${category} services with a focus on quality and security. Verified GenHub Partner.`,
        skills: [category, 'Customer Service', 'Safety Protocol'],
        imageUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        pricePerHour: 1200,
        rating: 5.0,
        reviewCount: 0,
        reviews: [],
        verificationBadges: ['Identity Verified', 'GenHub Partner'],
        availabilityStatus: 'Available',
        workingHours: '09:00 AM - 06:00 PM'
      };
      
      await dataService.onboardProfessional(newPro);
      setIsOnboarding(false);
      setIsProfessional(true);
      setHasOnboarded(true);
      // Refresh user profile
      const profile = await dataService.getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setIsProfessional(false);
    setHasOnboarded(false);
    setUserProfile(null);
  };

  if (isProfessional && hasOnboarded) {
    const isApproved = userProfile?.approvalStatus === 'approved';
    
    return (
      <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30 selection:text-on-surface">
        <NotificationManager professionalId={user?.uid || 'pro-me'} />
        <Navbar 
          onBecomePro={() => setIsOnboarding(true)} 
          isProfessional={true}
          onSwitchView={() => setIsProfessional(false)}
          hasOnboarded={true}
          approvalStatus={userProfile?.approvalStatus}
        />
        <main>
          {isApproved ? (
            <ProfessionalDashboard 
              onLogout={handleLogout} 
              onOpenChat={(bookingId) => {
                setActiveBookingId(bookingId);
                setIsChatOpen(true);
              }}
              onViewProfile={(status, hours) => {
                const myProfile: Professional = {
                  id: user?.uid || 'pro-me',
                  name: user?.displayName || 'Professional Partner',
                  title: 'Verified Specialist',
                  category: 'Cleaning',
                  experience: '5+ Years',
                  bio: 'I am a dedicated professional committed to providing top-tier services through GenHub.',
                  skills: ['Deep Cleaning', 'Sanitization', 'Organization'],
                  verificationBadges: ['Background Checked', 'Identity Verified', 'Top Rated'],
                  rating: 4.9,
                  reviewCount: 42,
                  imageUrl: user?.photoURL || 'https://picsum.photos/seed/pro/400/400',
                  reviews: mockProfessionals[0].reviews,
                  pricePerHour: 1200,
                  availabilityStatus: status,
                  workingHours: hours
                };
                setSelectedProfessional(myProfile);
              }}
            />
          ) : (
            <PendingApproval onBackToCustomer={() => setIsProfessional(false)} />
          )}
        </main>
        <AIChatbot />
        <AnimatePresence>
          {isOnboarding && (
            <ProfessionalOnboarding 
              onClose={() => setIsOnboarding(false)} 
              onComplete={handleOnboardingComplete}
            />
          )}
          {selectedProfessional && (
            <ProfessionalProfile 
              professional={selectedProfessional}
              onClose={() => setSelectedProfessional(null)}
              onBook={() => {}} // No booking from own profile
            />
          )}
          {isChatOpen && activeBookingId && (
            <Chat 
              bookingId={activeBookingId}
              professional={mockProfessionals[0]} // Fallback
              onClose={() => {
                setIsChatOpen(false);
                setActiveBookingId(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30 selection:text-on-surface">
      <NotificationManager professionalId={null} />
      <Navbar 
        onBecomePro={() => setIsOnboarding(true)} 
        isProfessional={isProfessional}
        onSwitchView={() => setIsProfessional(!isProfessional)}
        hasOnboarded={hasOnboarded}
        onSwitchToPro={() => setIsProfessional(true)}
        approvalStatus={userProfile?.approvalStatus}
      />
      <main>
        <Hero 
          onBecomePro={() => setIsOnboarding(true)} 
          hasOnboarded={hasOnboarded}
          onGoToDashboard={() => setIsProfessional(true)}
          onBookClick={() => document.getElementById('expert-network')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <HowItWorks />
        <Services onSelectCategory={setSelectedCategory} />
        <Security />
      </main>
      <Footer />
      <AIChatbot />

      {/* Floating Chat Button */}
      <AnimatePresence>
        {confirmedBooking && !isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              if (lastBookingId) {
                setActiveBookingId(lastBookingId);
                setIsChatOpen(true);
              }
            }}
            className="fixed bottom-6 right-24 z-[140] w-16 h-16 bg-primary text-on-primary-container rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
          >
            <MessageSquare className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
              1
            </div>
            <span className="absolute right-20 bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-white/10">
              Chat with {confirmedBooking.name}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCategory && (
          <ProfessionalList 
            category={selectedCategory}
            professionals={filteredProfessionals}
            onSelect={(pro) => {
              setSelectedProfessional(pro);
            }}
            onClose={() => setSelectedCategory(null)}
          />
        )}

        {selectedProfessional && !isPaying && (
          <ProfessionalProfile 
            professional={selectedProfessional}
            onClose={() => setSelectedProfessional(null)}
            onBook={handleBookingStart}
          />
        )}

        {isPaying && selectedProfessional && (
          <PaymentGateway 
            professional={selectedProfessional}
            onSuccess={handlePaymentSuccess}
            onClose={() => setIsPaying(false)}
          />
        )}

        {confirmedBooking && (
          <BookingConfirmation 
            professional={confirmedBooking}
            paymentMode={paymentMode}
            onClose={() => setConfirmedBooking(null)}
            onChat={() => {
              if (lastBookingId) {
                setActiveBookingId(lastBookingId);
                setIsChatOpen(true);
              }
            }}
          />
        )}

        {isChatOpen && activeBookingId && (
          <Chat 
            bookingId={activeBookingId}
            professional={selectedProfessional || mockProfessionals[0]} // Fallback for UI
            onClose={() => {
              setIsChatOpen(false);
              setActiveBookingId(null);
            }}
          />
        )}

        {isOnboarding && (
          <ProfessionalOnboarding 
            onClose={() => setIsOnboarding(false)} 
            onComplete={handleOnboardingComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
