import { Professional, ExpertStats, JobRequest, VerifiedDocument } from './types';

export const mockExpertStats: ExpertStats = {
  totalEarnings: 45250,
  completedJobs: 124,
  averageRating: 4.9,
  activeHours: 320,
  monthlyGrowth: 12.5
};

export const mockJobRequests: JobRequest[] = [
  {
    id: 'jr1',
    customerName: 'Aman Sharma',
    customerPhoto: 'https://picsum.photos/seed/aman/100/100',
    serviceType: 'Emergency Plumbing',
    location: 'Sector 45, Gurgaon',
    distance: '2.4 km',
    time: '10:30 AM',
    amount: 1200,
    status: 'New',
    verifiedBadges: ['Premium User', 'Identity Verified']
  },
  {
    id: 'jr2',
    customerName: 'Priya Verma',
    customerPhoto: 'https://picsum.photos/seed/priya/100/100',
    serviceType: 'Full House Cleaning',
    location: 'Cyber City, Phase 2',
    distance: '4.1 km',
    time: '02:00 PM',
    amount: 2500,
    status: 'New',
    verifiedBadges: ['Top Rated Customer']
  },
  {
    id: 'jr3',
    customerName: 'Rahul Gupta',
    customerPhoto: 'https://picsum.photos/seed/rahul/100/100',
    serviceType: 'AC Maintenance',
    location: 'DLF Phase 3',
    distance: '1.2 km',
    time: '04:30 PM',
    amount: 800,
    status: 'Accepted',
    verifiedBadges: ['Identity Verified']
  }
];

export const mockVerifiedDocuments: VerifiedDocument[] = [
  {
    id: 'doc1',
    name: 'Aadhar Card (Identity)',
    status: 'Verified',
    type: 'ID'
  },
  {
    id: 'doc2',
    name: 'Trade License (Electrician)',
    status: 'Verified',
    expiryDate: '2027-12-31',
    type: 'License'
  },
  {
    id: 'doc3',
    name: 'Background Verification Report',
    status: 'Verified',
    type: 'BackgroundCheck'
  },
  {
    id: 'doc4',
    name: 'Skill Certification (Advanced IoT)',
    status: 'Pending',
    type: 'Certification'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Healthcare Specialist',
    category: 'Healthcare',
    experience: '12 Years',
    degree: 'MD in Internal Medicine',
    specialization: 'Family Medicine & Preventive Care',
    location: 'Cyber City, Gurgaon',
    bio: 'Dedicated healthcare professional with over a decade of experience in providing compassionate care and expert medical advice. Specializing in family medicine and preventive care.',
    skills: ['Family Medicine', 'Preventive Care', 'Patient Education', 'Emergency Response'],
    verificationBadges: ['Medical Board Certified', 'Identity Verified', 'Background Checked', 'AI-Verified Skills'],
    rating: 4.9,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/seed/sarah/400/400',
    pricePerHour: 500,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 05:00 PM',
    reviews: [
      { id: 'r1', userName: 'John Doe', rating: 5, comment: 'Excellent care and very professional.', date: '2 days ago' },
      { id: 'r2', userName: 'Jane Smith', rating: 4, comment: 'Very knowledgeable and helpful.', date: '1 week ago' }
    ]
  },
  {
    id: '5',
    name: 'Dr. Amit Patel',
    title: 'Cardiologist',
    category: 'Healthcare',
    experience: '15 Years',
    degree: 'MD, DM in Cardiology',
    specialization: 'Non-invasive Cardiology',
    location: 'Sector 45, Gurgaon',
    bio: 'Specializing in non-invasive cardiology and heart health management. Committed to providing personalized care for every patient.',
    skills: ['Cardiology', 'Heart Health', 'Diagnostic Imaging', 'Patient Wellness'],
    verificationBadges: ['Board Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 210,
    imageUrl: 'https://picsum.photos/seed/amit/400/400',
    pricePerHour: 1200,
    availabilityStatus: 'Available',
    workingHours: '10:00 AM - 04:00 PM',
    reviews: [
      { id: 'r9', userName: 'Sanjay M.', rating: 5, comment: 'Very thorough and explaining everything clearly.', date: '1 week ago' }
    ]
  },
  {
    id: '13',
    name: 'Dr. Lisa Wong',
    title: 'Pediatrician',
    category: 'Healthcare',
    experience: '9 Years',
    degree: 'MD in Pediatrics',
    specialization: 'Child Development & Immunization',
    location: 'DLF Phase 3, Gurgaon',
    bio: 'Compassionate pediatrician dedicated to the health and well-being of children from infancy through adolescence.',
    skills: ['Pediatrics', 'Child Development', 'Immunization', 'Parental Guidance'],
    verificationBadges: ['Board Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 110,
    imageUrl: 'https://picsum.photos/seed/lisa/400/400',
    pricePerHour: 600,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 05:00 PM',
    reviews: [
      { id: 'r17', userName: 'Sarah L.', rating: 5, comment: 'Dr. Wong is so patient with my kids.', date: '4 days ago' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Master Electrician',
    category: 'Electrician',
    experience: '8 Years',
    degree: 'Certified Master Electrician',
    specialization: 'Residential & Commercial Wiring',
    location: 'Sohna Road, Gurgaon',
    bio: 'Expert electrician specializing in residential and commercial wiring, troubleshooting, and smart home installations. Committed to safety and quality workmanship.',
    skills: ['Residential Wiring', 'Commercial Wiring', 'Smart Home Setup', 'Troubleshooting'],
    verificationBadges: ['Licensed Electrician', 'Identity Verified', 'Background Checked', 'Safety Certified'],
    rating: 4.8,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/seed/michael/400/400',
    pricePerHour: 550,
    availabilityStatus: 'Busy',
    workingHours: '10:00 AM - 06:00 PM',
    reviews: [
      { id: 'r3', userName: 'Alice Brown', rating: 5, comment: 'Fixed my wiring issue quickly and efficiently.', date: '3 days ago' },
      { id: 'r4', userName: 'Bob Wilson', rating: 4, comment: 'Great service, highly recommended.', date: '2 weeks ago' }
    ]
  },
  {
    id: '10',
    name: 'David Miller',
    title: 'Commercial Electrician',
    category: 'Electrician',
    experience: '15 Years',
    degree: 'Industrial Electrical Engineering',
    specialization: 'Large-scale Systems & Maintenance',
    location: 'Cyber Hub, Gurgaon',
    bio: 'Expert in large-scale commercial electrical systems, maintenance, and emergency repairs.',
    skills: ['Commercial Systems', 'Maintenance', 'Emergency Repair', 'Safety Audits'],
    verificationBadges: ['Master Electrician', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 180,
    imageUrl: 'https://picsum.photos/seed/david/400/400',
    pricePerHour: 750,
    availabilityStatus: 'Available',
    workingHours: '07:00 AM - 04:00 PM',
    reviews: [
      { id: 'r14', userName: 'Tom H.', rating: 5, comment: 'Very reliable and professional service.', date: '1 week ago' }
    ]
  },
  {
    id: '4',
    name: 'Rajesh Kumar',
    title: 'Expert Plumber',
    category: 'Plumbing',
    experience: '15 Years',
    degree: 'Vocational Training in Plumbing',
    specialization: 'Leak Detection & Pipe Repair',
    location: 'Sector 56, Gurgaon',
    bio: 'Highly skilled plumber with extensive experience in residential and commercial plumbing systems. Specializing in leak detection, pipe repair, and fixture installation.',
    skills: ['Leak Detection', 'Pipe Repair', 'Fixture Installation', 'Drain Cleaning'],
    verificationBadges: ['Licensed Plumber', 'Identity Verified', 'Background Checked', 'Safety Certified'],
    rating: 4.7,
    reviewCount: 210,
    imageUrl: 'https://picsum.photos/seed/rajesh/400/400',
    pricePerHour: 600,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 07:00 PM',
    reviews: [
      { id: 'r7', userName: 'Eve Foster', rating: 5, comment: 'Fixed my leaky faucet in no time.', date: '4 days ago' },
      { id: 'r8', userName: 'Frank Green', rating: 4, comment: 'Good service and fair pricing.', date: '3 weeks ago' }
    ]
  },
  {
    id: '12',
    name: 'Ravi Kumar',
    title: 'Industrial Plumber',
    category: 'Plumbing',
    experience: '20 Years',
    degree: 'Advanced Plumbing Certification',
    specialization: 'Industrial & High-Pressure Systems',
    location: 'IMT Manesar, Gurgaon',
    bio: 'Expert in industrial plumbing, high-pressure systems, and complex installations.',
    skills: ['Industrial Plumbing', 'High-Pressure Systems', 'Installation', 'Maintenance'],
    verificationBadges: ['Master Plumber', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 250,
    imageUrl: 'https://picsum.photos/seed/ravi/400/400',
    pricePerHour: 900,
    availabilityStatus: 'Available',
    workingHours: '08:00 AM - 06:00 PM',
    reviews: [
      { id: 'r16', userName: 'Vijay G.', rating: 5, comment: 'The best plumber for complex industrial work.', date: '3 days ago' }
    ]
  },
  {
    id: '7',
    name: 'Vikram Singh',
    title: 'Senior Mechanic',
    category: 'Mechanic',
    experience: '10 Years',
    degree: 'Automobile Engineering Diploma',
    specialization: 'Engine Diagnostics & Luxury Cars',
    location: 'Sector 14, Gurgaon',
    bio: 'Specializing in luxury car repairs and engine diagnostics. I provide on-site services for your convenience.',
    skills: ['Engine Repair', 'Diagnostics', 'Brake Systems', 'Luxury Cars'],
    verificationBadges: ['Certified Mechanic', 'Identity Verified', 'Background Checked'],
    rating: 4.7,
    reviewCount: 150,
    imageUrl: 'https://picsum.photos/seed/vikram/400/400',
    pricePerHour: 700,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 07:00 PM',
    reviews: [
      { id: 'r11', userName: 'Rohan K.', rating: 5, comment: 'Fixed my BMW engine issue perfectly.', date: '5 days ago' }
    ]
  },
  {
    id: '14',
    name: 'Marcus Thorne',
    title: 'Master Mechanic',
    category: 'Mechanic',
    experience: '18 Years',
    degree: 'ASE Master Technician',
    specialization: 'Classic Car Restoration & Tuning',
    location: 'Golf Course Road, Gurgaon',
    bio: 'Expert in classic car restoration and high-performance tuning. If it has an engine, I can fix it.',
    skills: ['Restoration', 'Performance Tuning', 'Transmission', 'Classic Cars'],
    verificationBadges: ['ASE Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 320,
    imageUrl: 'https://picsum.photos/seed/marcus/400/400',
    pricePerHour: 850,
    availabilityStatus: 'Busy',
    workingHours: '10:00 AM - 08:00 PM',
    reviews: [
      { id: 'r18', userName: 'James P.', rating: 5, comment: 'The only person I trust with my vintage Mustang.', date: '1 week ago' }
    ]
  },
  {
    id: '6',
    name: 'Sonia Gupta',
    title: 'Professional Housekeeper',
    category: 'Maid Services',
    experience: '6 Years',
    degree: 'Hospitality Management Training',
    specialization: 'Deep Cleaning & Organization',
    location: 'DLF Phase 5, Gurgaon',
    bio: 'Expert in deep cleaning, organization, and home maintenance. I take pride in making your living space spotless and comfortable.',
    skills: ['Deep Cleaning', 'Organization', 'Laundry', 'Eco-friendly Products'],
    verificationBadges: ['Background Checked', 'Identity Verified', 'Top Rated'],
    rating: 4.8,
    reviewCount: 95,
    imageUrl: 'https://picsum.photos/seed/sonia/400/400',
    pricePerHour: 500,
    availabilityStatus: 'Available',
    workingHours: '08:00 AM - 06:00 PM',
    reviews: [
      { id: 'r10', userName: 'Anjali R.', rating: 5, comment: 'Sonia is amazing! My house has never been cleaner.', date: '3 days ago' }
    ]
  },
  {
    id: '15',
    name: 'Elena Rodriguez',
    title: 'Executive Housekeeper',
    category: 'Maid Services',
    experience: '12 Years',
    degree: 'Estate Management Certification',
    specialization: 'Luxury Estate Management',
    location: 'Ambience Island, Gurgaon',
    bio: 'Specializing in luxury estate management and high-end residential cleaning services.',
    skills: ['Estate Management', 'Fine Fabric Care', 'Event Cleanup', 'Staff Training'],
    verificationBadges: ['Background Checked', 'Identity Verified', 'Premium Verified'],
    rating: 5.0,
    reviewCount: 145,
    imageUrl: 'https://picsum.photos/seed/elena/400/400',
    pricePerHour: 750,
    availabilityStatus: 'Available',
    workingHours: '07:00 AM - 03:00 PM',
    reviews: [
      { id: 'r19', userName: 'Robert D.', rating: 5, comment: 'Elena is professional, discreet, and thorough.', date: '2 days ago' }
    ]
  },
  {
    id: '3',
    name: 'Priya Sharma',
    title: 'Senior Legal Consultant',
    category: 'Legal Services',
    experience: '10 Years',
    degree: 'LLB, LLM in Corporate Law',
    specialization: 'Corporate Law & Negotiations',
    location: 'Cyber Hub, Gurgaon',
    bio: 'Experienced legal consultant specializing in corporate law, contract negotiations, and dispute resolution. Providing expert legal advice to individuals and businesses.',
    skills: ['Corporate Law', 'Contract Negotiation', 'Dispute Resolution', 'Legal Advice'],
    verificationBadges: ['Bar Association Member', 'Identity Verified', 'Background Checked', 'AI-Verified Expertise'],
    rating: 4.9,
    reviewCount: 156,
    imageUrl: 'https://picsum.photos/seed/priya/400/400',
    pricePerHour: 800,
    availabilityStatus: 'Available',
    workingHours: '08:00 AM - 04:00 PM',
    reviews: [
      { id: 'r5', userName: 'Charlie Davis', rating: 5, comment: 'Very professional and knowledgeable legal advice.', date: '1 day ago' },
      { id: 'r6', userName: 'Diana Evans', rating: 5, comment: 'Helped me with a complex contract negotiation.', date: '1 month ago' }
    ]
  },
  {
    id: '11',
    name: 'Ananya Verma',
    title: 'Family Lawyer',
    category: 'Legal Services',
    experience: '8 Years',
    degree: 'LLB in Family Law',
    specialization: 'Mediation & Estate Planning',
    location: 'Sector 31, Gurgaon',
    bio: 'Specializing in family law, mediation, and estate planning. Providing compassionate and effective legal representation.',
    skills: ['Family Law', 'Mediation', 'Estate Planning', 'Legal Counseling'],
    verificationBadges: ['Bar Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.8,
    reviewCount: 75,
    imageUrl: 'https://picsum.photos/seed/ananya/400/400',
    pricePerHour: 1200,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 05:00 PM',
    reviews: [
      { id: 'r15', userName: 'Pooja B.', rating: 5, comment: 'Ananya was very helpful during a difficult time.', date: '2 weeks ago' }
    ]
  },
  {
    id: '8',
    name: 'Neha Kapoor',
    title: 'Chartered Accountant',
    category: 'CA Experts',
    experience: '7 Years',
    degree: 'Chartered Accountant (ICAI)',
    specialization: 'Tax Planning & GST Compliance',
    location: 'Udyog Vihar, Gurgaon',
    bio: 'Expert in tax planning, GST compliance, and financial auditing for small to medium enterprises.',
    skills: ['Tax Planning', 'GST Compliance', 'Auditing', 'Financial Strategy'],
    verificationBadges: ['CA Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 88,
    imageUrl: 'https://picsum.photos/seed/neha/400/400',
    pricePerHour: 1500,
    availabilityStatus: 'Available',
    workingHours: '10:00 AM - 06:00 PM',
    reviews: [
      { id: 'r12', userName: 'Karan J.', rating: 5, comment: 'Neha helped me save a lot on taxes this year.', date: '2 weeks ago' }
    ]
  },
  {
    id: '16',
    name: 'Samir Khan',
    title: 'Tax Consultant & CA',
    category: 'CA Experts',
    experience: '15 Years',
    degree: 'FCA, MBA in Finance',
    specialization: 'Corporate Tax & Wealth Management',
    location: 'Golf Course Extension, Gurgaon',
    bio: 'Providing strategic tax advice and financial planning for high-net-worth individuals and corporations.',
    skills: ['Corporate Tax', 'Wealth Management', 'International Tax', 'Financial Planning'],
    verificationBadges: ['CA Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 195,
    imageUrl: 'https://picsum.photos/seed/samir/400/400',
    pricePerHour: 2000,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 05:00 PM',
    reviews: [
      { id: 'r20', userName: 'Zoya A.', rating: 5, comment: 'Samir transformed our company financial structure.', date: '3 weeks ago' }
    ]
  },
  {
    id: '9',
    name: 'Arjun Reddy',
    title: 'Civil Engineer & Contractor',
    category: 'Construction',
    experience: '12 Years',
    degree: 'B.Tech in Civil Engineering',
    specialization: 'Residential Construction & Renovation',
    location: 'Sector 43, Gurgaon',
    bio: 'Specializing in residential construction, renovations, and structural repairs. Quality and safety are my top priorities.',
    skills: ['Construction Management', 'Renovation', 'Structural Repair', 'Safety Compliance'],
    verificationBadges: ['Licensed Contractor', 'Identity Verified', 'Background Checked'],
    rating: 4.8,
    reviewCount: 120,
    imageUrl: 'https://picsum.photos/seed/arjun/400/400',
    pricePerHour: 1000,
    availabilityStatus: 'Busy',
    workingHours: '08:00 AM - 05:00 PM',
    reviews: [
      { id: 'r13', userName: 'Meera S.', rating: 5, comment: 'Arjun handled our home renovation flawlessly.', date: '1 month ago' }
    ]
  },
  {
    id: '17',
    name: 'Robert Taylor',
    title: 'Structural Engineer',
    category: 'Construction',
    experience: '20 Years',
    degree: 'M.Tech in Structural Engineering',
    specialization: 'Seismic Retrofitting & Assessments',
    location: 'Cyber City, Gurgaon',
    bio: 'Expert in structural integrity assessments, foundation repair, and seismic retrofitting.',
    skills: ['Structural Analysis', 'Foundation Repair', 'Retrofitting', 'Blueprint Review'],
    verificationBadges: ['Licensed Engineer', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 160,
    imageUrl: 'https://picsum.photos/seed/robert/400/400',
    pricePerHour: 1500,
    availabilityStatus: 'Available',
    workingHours: '08:00 AM - 04:00 PM',
    reviews: [
      { id: 'r21', userName: 'Kevin W.', rating: 5, comment: 'Very professional assessment of our building foundation.', date: '1 week ago' }
    ]
  },
  {
    id: '18',
    name: 'Maya Iyer',
    title: 'Corporate Lawyer',
    category: 'Legal Services',
    experience: '14 Years',
    degree: 'LLM from National Law School',
    specialization: 'Mergers & Acquisitions',
    location: 'Sector 44, Gurgaon',
    bio: 'Specializing in mergers and acquisitions, intellectual property, and corporate governance.',
    skills: ['M&A', 'Intellectual Property', 'Governance', 'Contract Law'],
    verificationBadges: ['Bar Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 130,
    imageUrl: 'https://picsum.photos/seed/maya/400/400',
    pricePerHour: 1800,
    availabilityStatus: 'Busy',
    workingHours: '10:00 AM - 07:00 PM',
    reviews: [
      { id: 'r22', userName: 'Startup Hub', rating: 5, comment: 'Maya is our go-to for all IP related matters.', date: '2 weeks ago' }
    ]
  },
  {
    id: '19',
    name: 'Steve Jobs (Mock)',
    title: 'Smart Home Electrician',
    category: 'Electrician',
    experience: '5 Years',
    degree: 'B.E. in Electrical Engineering',
    specialization: 'Home Automation & IoT',
    location: 'Cyber Hub, Gurgaon',
    bio: 'Specializing in home automation, IoT integration, and high-end lighting design.',
    skills: ['Home Automation', 'IoT', 'Lighting Design', 'Solar Integration'],
    verificationBadges: ['Licensed Electrician', 'Identity Verified', 'Background Checked'],
    rating: 4.7,
    reviewCount: 65,
    imageUrl: 'https://picsum.photos/seed/steve/400/400',
    pricePerHour: 650,
    availabilityStatus: 'Available',
    workingHours: '11:00 AM - 08:00 PM',
    reviews: [
      { id: 'r23', userName: 'Gadget Freak', rating: 5, comment: 'My smart home setup is finally working perfectly.', date: '5 days ago' }
    ]
  },
  {
    id: '20',
    name: 'Linda Chen',
    title: 'Emergency Plumber',
    category: 'Plumbing',
    experience: '10 Years',
    degree: 'Advanced Plumbing Diploma',
    specialization: 'Emergency Repairs & Water Damage',
    location: 'Sector 29, Gurgaon',
    bio: 'Available 24/7 for emergency plumbing repairs, burst pipes, and severe leaks.',
    skills: ['Emergency Repair', 'Leak Detection', 'Pipe Replacement', 'Water Damage Control'],
    verificationBadges: ['Licensed Plumber', 'Identity Verified', 'Background Checked'],
    rating: 4.8,
    reviewCount: 140,
    imageUrl: 'https://picsum.photos/seed/linda/400/400',
    pricePerHour: 800,
    availabilityStatus: 'Available',
    workingHours: '24/7 (On Call)',
    reviews: [
      { id: 'r24', userName: 'Night Owl', rating: 5, comment: 'Linda saved us from a major flood at 3 AM.', date: '1 day ago' }
    ]
  },
  {
    id: '21',
    name: 'Arjun Malhotra',
    title: 'Senior Tax Consultant',
    category: 'CA Experts',
    experience: '12 Years',
    degree: 'Chartered Accountant, CS',
    specialization: 'International Taxation',
    location: 'Udyog Vihar, Gurgaon',
    bio: 'Expert in international taxation, transfer pricing, and corporate financial planning.',
    skills: ['International Tax', 'Transfer Pricing', 'Corporate Finance', 'Audit'],
    verificationBadges: ['CA Certified', 'Identity Verified', 'Background Checked'],
    rating: 4.9,
    reviewCount: 115,
    imageUrl: 'https://picsum.photos/seed/malhotra/400/400',
    pricePerHour: 2500,
    availabilityStatus: 'Available',
    workingHours: '09:00 AM - 06:00 PM',
    reviews: [
      { id: 'r25', userName: 'Global Corp', rating: 5, comment: 'Arjun is the best for cross-border tax issues.', date: '1 month ago' }
    ]
  }
];
