export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  category: string;
  experience: string;
  bio: string;
  skills: string[];
  verificationBadges: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
  reviews: Review[];
  pricePerHour: number;
  availabilityStatus?: 'Available' | 'Busy';
  workingHours?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  degree?: string;
  specialization?: string;
  location?: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: 'customer' | 'professional' | 'admin';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Booking {
  id?: string;
  customerId: string;
  professionalId: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  amount: number;
  paymentMode: 'full' | 'advance';
  createdAt: string;
}

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  bookingId: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ExpertStats {
  totalEarnings: number;
  completedJobs: number;
  averageRating: number;
  activeHours: number;
  monthlyGrowth: number;
}

export interface JobRequest {
  id: string;
  customerName: string;
  customerPhoto?: string;
  serviceType: string;
  location: string;
  distance: string;
  time: string;
  amount: number;
  status: 'New' | 'Accepted' | 'Declined' | 'Completed';
  verifiedBadges: string[];
}

export interface VerifiedDocument {
  id: string;
  name: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  expiryDate?: string;
  type: 'ID' | 'License' | 'Certification' | 'BackgroundCheck';
}
