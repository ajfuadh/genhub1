import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  User, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  MessageSquare,
  ShieldCheck,
  X,
  AlertTriangle,
  Settings,
  Circle,
  Bell,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { dataService } from '../services/dataService';
import { Booking, Review, Professional, VerifiedDocument } from '../types';
import { mockVerifiedDocuments } from '../mockData';

interface ProfessionalDashboardProps {
  onLogout: () => void;
  onViewProfile?: (status: 'Available' | 'Busy', hours: string) => void;
  onOpenChat: (bookingId: string) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onLogout, onViewProfile, onOpenChat }) => {
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [cancellingAppointment, setCancellingAppointment] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [status, setStatus] = useState<'Available' | 'Busy'>('Available');
  const [workingHours, setWorkingHours] = useState('09:00 AM - 06:00 PM');
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [loading, setLoading] = useState(true);

  const mockReviews: Review[] = [
    {
      id: '1',
      userName: 'Suresh K.',
      rating: 5,
      comment: 'Excellent service! Very professional and thorough cleaning.',
      date: '2 days ago'
    },
    {
      id: '2',
      userName: 'Meera J.',
      rating: 4,
      comment: 'Good work, arrived on time. Highly recommended.',
      date: '1 week ago'
    }
  ];

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = dataService.onUserBookings(auth.currentUser.uid, 'professional', (bookings) => {
        // Ensure unique IDs for appointments
        const uniqueBookings = bookings.filter((b, i, s) => i === s.findIndex(t => t.id === b.id));
        setAppointments(uniqueBookings);
        setLoading(false);
      });

      // Fetch professional details
      const fetchProDetails = async () => {
        const proDoc = await getDoc(doc(db, 'professionals', auth.currentUser!.uid));
        if (proDoc.exists()) {
          const data = proDoc.data() as Professional;
          if (data.availabilityStatus) setStatus(data.availabilityStatus);
          if (data.workingHours) setWorkingHours(data.workingHours);
        }
      };
      fetchProDetails();

      return () => unsubscribe();
    }
  }, []);

  const handleStatusChange = async (newStatus: 'Available' | 'Busy') => {
    setStatus(newStatus);
    if (auth.currentUser) {
      await dataService.updateProfessionalStatus(auth.currentUser.uid, newStatus);
    }
  };

  const handleSaveHours = async () => {
    setIsEditingHours(false);
    if (auth.currentUser) {
      await dataService.updateProfessionalWorkingHours(auth.currentUser.uid, workingHours);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-on-surface/10 text-on-surface border-on-surface/20';
    }
  };

  const handleCancelAppointment = async (id: string) => {
    await dataService.updateBookingStatus(id, 'Cancelled');
    
    // Notify server via API for WebSocket broadcast
    try {
      await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: id,
          professionalId: auth.currentUser?.uid,
          reason: cancellationReason || "Cancelled by professional",
          cancelledBy: "Professional"
        })
      });
    } catch (err) {
      console.error("Failed to send cancellation notification:", err);
    }

    setCancellingAppointment(null);
    setCancellationReason("");
  };

  const handleStartService = async (id: string) => {
    // In a real app, this might change status to 'In Progress'
    await dataService.updateBookingStatus(id, 'Confirmed'); 
  };

  const handleLogout = () => {
    auth.signOut();
    onLogout();
  };

  const earningsData = [
    { name: 'Oct', value: 12000 },
    { name: 'Nov', value: 15000 },
    { name: 'Dec', value: 18500 },
    { name: 'Jan', value: 14000 },
    { name: 'Feb', value: 21000 },
    { name: 'Mar', value: 24500 },
  ];

  const completionData = [
    { name: 'Cleaning', value: 98 },
    { name: 'Plumbing', value: 95 },
    { name: 'Electrical', value: 100 },
    { name: 'Carpentry', value: 92 },
  ];

  const ratingData = [
    { name: '5 Stars', value: 35, color: '#10b981' },
    { name: '4 Stars', value: 5, color: '#3b82f6' },
    { name: '3 Stars', value: 2, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-28 pb-20">
      <div className="branded-container space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-2 h-2 rounded-full ${status === 'Available' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status === 'Available' ? 'Active & Online' : 'Busy / Away'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold font-headline tracking-tight mb-4">Professional Dashboard.</h1>
            <p className="text-base text-on-surface-variant font-medium">Welcome back, Partner. Here's your performance overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onViewProfile?.(status, workingHours)}
              className="px-6 py-2.5 border border-outline-variant/10 text-on-surface rounded-2xl font-bold hover:bg-surface-container-high transition-all text-[10px] uppercase tracking-widest hidden sm:block"
            >
              View Public Profile
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-2xl font-bold hover:bg-surface-container-highest transition-all text-[10px] uppercase tracking-widest"
            >
              Logout
            </button>
            <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
              <User className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="relative group">
            <StatCard 
              icon={<DollarSign className="w-5 h-5" />}
              label="Total Earnings"
              value="₹24,500"
              trend="+12% this month"
              color="primary"
            />
            <button className="absolute top-6 right-6 text-[8px] font-bold bg-primary text-on-primary px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
              Withdraw
            </button>
          </div>
          <StatCard 
            icon={<Calendar className="w-5 h-5" />}
            label="Appointments"
            value="18"
            trend="3 pending today"
            color="tertiary"
          />
          <StatCard 
            icon={<Star className="w-5 h-5" />}
            label="Avg. Rating"
            value="4.9"
            trend="From 42 reviews"
            color="emerald"
          />
          <StatCard 
            icon={<TrendingUp className="w-5 h-5" />}
            label="Completion Rate"
            value="98%"
            trend="Top 5% in area"
            color="amber"
          />
        </div>

        {/* Performance Insights Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline tracking-tight flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" /> Performance Insights
            </h2>
            <div className="flex items-center gap-2 bg-surface-container-high p-1 rounded-xl border border-outline-variant/10">
              <button className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-widest">Monthly</button>
              <button className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">Quarterly</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-lg bg-surface-container-low">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Earnings Growth</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Revenue over the last 6 months</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">₹24,500</span>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">+12.5% vs last month</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline-variant), 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-on-surface-variant)' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-on-surface-variant)' }}
                      tickFormatter={(value) => `₹${value/1000}k`}
                    />
                    <Tooltip 
                      cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface-container-high)', 
                        border: '1px solid rgba(var(--color-outline-variant), 0.2)',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: 'var(--color-primary)' }}
                      labelStyle={{ color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-primary)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorEarnings)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ratings Distribution */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-lg bg-surface-container-low flex flex-col">
              <h3 className="text-lg font-bold tracking-tight mb-2">Rating Distribution</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-8">Customer satisfaction breakdown</p>
              
              <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface-container-high)', 
                        border: '1px solid rgba(var(--color-outline-variant), 0.2)',
                        borderRadius: '16px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black">4.9</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant">Avg Score</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {ratingData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.name}</span>
                    </div>
                    <span className="text-xs font-black">{item.value} reviews</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Rate by Service */}
            <div className="lg:col-span-3 glass-card p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-lg bg-surface-container-low">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Service Efficiency</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Completion rate percentage by category</p>
                </div>
                <BarChart3 className="w-6 h-6 text-amber-500" />
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-outline-variant), 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-on-surface-variant)' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      domain={[0, 100]}
                      tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-on-surface-variant)' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(var(--color-primary), 0.05)' }}
                      formatter={(value: number) => [`${value}%`, 'Completion Rate']}
                      contentStyle={{ 
                        backgroundColor: 'var(--color-surface-container-high)', 
                        border: '1px solid rgba(var(--color-outline-variant), 0.2)',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: 'var(--color-primary)' }}
                      labelStyle={{ color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 95 ? 'var(--color-primary)' : 'var(--color-amber-500)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Appointments List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline tracking-tight flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" /> Upcoming Appointments
              </h2>
              <button className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">Fetching your schedule...</p>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((apt, idx) => (
                  <motion.div 
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-6 rounded-3xl border border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/30 hover:bg-surface-container-high transition-all group relative overflow-hidden"
                  >
                    {/* Status Glow Background */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -mr-16 -mt-16 rounded-full ${
                      apt.status === 'Confirmed' ? 'bg-emerald-500' : 
                      apt.status === 'Pending' ? 'bg-amber-500' : 'bg-primary'
                    }`} />

                    <div className="flex items-start gap-6 relative z-10">
                      {/* Date/Time Block */}
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/10 shadow-sm">
                        <span className="text-[10px] font-black uppercase text-primary leading-none tracking-widest mb-1">
                          {new Date(apt.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black leading-none tracking-tight text-on-surface">
                          {new Date(apt.date).getDate()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">
                            {apt.service}
                          </h3>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          <span className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-lg">
                            <User className="w-3.5 h-3.5 text-primary" /> 
                            ID: {apt.customerId.slice(0, 8)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {apt.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" /> {apt.paymentMode === 'full' ? 'Full Payment' : 'Advance Paid'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 relative z-10">
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Total Amount</p>
                        <span className="text-2xl font-black tracking-tighter text-on-surface">₹{apt.amount}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onOpenChat(apt.id!)}
                          className="p-3 bg-surface-container-highest text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-2xl transition-all border border-outline-variant/10"
                          title="Open Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCancellingAppointment(apt)}
                          className="p-3 bg-surface-container-highest text-on-surface-variant hover:text-error hover:bg-error/10 rounded-2xl transition-all border border-outline-variant/10"
                          title="Cancel Appointment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {apt.status === 'Pending' && (
                          <button 
                            onClick={() => handleStartService(apt.id!)}
                            className="px-6 py-3 bg-primary text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button 
                            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            Start Job
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                  <Calendar className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                  <p className="text-on-surface-variant font-medium">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Reviews & Quick Actions */}
          <div className="space-y-8">
            {/* Reviews Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Recent Reviews
              </h2>
              <div className="space-y-4">
                {mockReviews.filter((r, i, s) => i === s.findIndex(t => t.id === r.id)).map((review) => (
                  <div key={review.id} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{review.userName}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-outline-variant'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant italic mb-2">"{review.comment}"</p>
                    <span className="text-[10px] text-on-surface-variant/60 uppercase font-bold tracking-widest">{review.date}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 border border-outline-variant/30 rounded-xl text-sm font-bold hover:bg-surface-container-high transition-all">
                View All Reviews
              </button>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" /> Quick Actions
              </h3>
              <div className="space-y-2">
                <QuickAction label="Update Availability" />
                <QuickAction label="Service Pricing" />
                <QuickAction label="Support Center" />
                <QuickAction label="Payout Settings" />
              </div>
            </div>

            {/* Verification Status */}
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-500">
                <ShieldCheck className="w-4 h-4" /> Verification Status
              </h3>
              <div className="space-y-3">
                {mockVerifiedDocuments.filter((d, i, s) => i === s.findIndex(t => t.id === d.id)).slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-tight">{doc.name}</p>
                        <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest">{doc.status}</p>
                      </div>
                    </div>
                    {doc.status === 'Verified' && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                  </div>
                ))}
                <button className="w-full mt-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Manage Documents
                </button>
              </div>
            </div>

            {/* Availability Settings */}
            <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Availability Settings
              </h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Current Status</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange('Available')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${status === 'Available' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                      <Circle className={`w-2 h-2 fill-current ${status === 'Available' ? 'text-white' : 'text-emerald-500'}`} />
                      Available
                    </button>
                    <button 
                      onClick={() => handleStatusChange('Busy')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${status === 'Busy' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                    >
                      <Circle className={`w-2 h-2 fill-current ${status === 'Busy' ? 'text-white' : 'text-amber-500'}`} />
                      Busy
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Working Hours</p>
                    <button 
                      onClick={() => isEditingHours ? handleSaveHours() : setIsEditingHours(true)}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      {isEditingHours ? 'Save' : 'Edit'}
                    </button>
                  </div>
                  {isEditingHours ? (
                    <input 
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
                      placeholder="e.g. 09:00 AM - 05:00 PM"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                      <Clock className="w-4 h-4 text-primary" />
                      {workingHours}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {cancellingAppointment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingAppointment(null)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-high border border-outline-variant/20 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black mb-2">Cancel Appointment?</h2>
              <p className="text-on-surface-variant mb-6">
                Are you sure you want to cancel the <span className="text-on-surface font-bold">{cancellingAppointment.service}</span> appointment? This action cannot be undone.
              </p>
              
              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Reason for Cancellation</label>
                <textarea 
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Schedule conflict, Emergency..."
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-error transition-all min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setCancellingAppointment(null)}
                  className="flex-1 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-bold hover:brightness-110 transition-all"
                >
                  Keep It
                </button>
                <button 
                  onClick={() => handleCancelAppointment(cancellingAppointment.id!)}
                  className="flex-1 py-4 bg-error text-on-error rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-error/20"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Simulation Controls Removed - Real Data Active */}
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => {
  const colorMap: any = {
    primary: 'bg-primary/10 text-primary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="glass-card p-8 rounded-[2.5rem] border border-outline-variant/5 shadow-lg"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">{label}</p>
      <h3 className="text-3xl font-bold font-headline tracking-tight mb-3">{value}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" /> {trend}
      </p>
    </motion.div>
  );
};

const QuickAction = ({ label }: { label: string }) => (
  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 transition-all group">
    <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
    <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-all" />
  </button>
);
