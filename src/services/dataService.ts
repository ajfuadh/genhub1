import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { UserProfile, Professional, Booking, Message } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dataService = {
  // User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.uid}`;
    try {
      // Filter out undefined values to prevent Firestore errors
      const cleanProfile = Object.fromEntries(
        Object.entries(profile).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'users', profile.uid), cleanProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Professionals
  async getProfessionalById(id: string): Promise<Professional | null> {
    const path = `professionals/${id}`;
    try {
      const docRef = doc(db, 'professionals', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Professional) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async getProfessionals(category?: string): Promise<Professional[]> {
    const path = 'professionals';
    try {
      const colRef = collection(db, 'professionals');
      const q = category 
        ? query(colRef, where('category', '==', category))
        : colRef;
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professional));
      
      // If database is empty, we might want to seed it or return mock data
      // For now, we'll just return what's in Firestore.
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async seedProfessionals(mockPros: Professional[]): Promise<void> {
    try {
      const colRef = collection(db, 'professionals');
      const q = query(colRef, limit(1));
      const snapshot = await getDocs(q);
      
      // If collection is completely empty, seed it
      if (snapshot.empty) {
        console.log('Database empty. Seeding professionals in Firestore...');
        const promises = mockPros.map(pro => {
          const { id, ...data } = pro;
          return setDoc(doc(db, 'professionals', id), {
            ...data,
            approvalStatus: 'approved'
          });
        });
        await Promise.all(promises);
        console.log('Seeding complete.');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  },

  async onboardProfessional(pro: Professional): Promise<void> {
    const proPath = `professionals/${pro.id}`;
    const userPath = `users/${pro.id}`;
    
    try {
      const cleanPro = Object.fromEntries(
        Object.entries({
          ...pro,
          approvalStatus: 'pending'
        }).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'professionals', pro.id), cleanPro);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, proPath);
    }

    try {
      // Also update user role and status
      await updateDoc(doc(db, 'users', pro.id), { 
        role: 'professional',
        approvalStatus: 'pending'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  },

  // Bookings
  async createBooking(booking: Omit<Booking, 'id'>): Promise<string> {
    const path = 'bookings';
    try {
      const cleanBooking = Object.fromEntries(
        Object.entries({
          ...booking,
          createdAt: new Date().toISOString()
        }).filter(([_, v]) => v !== undefined)
      );
      const docRef = await addDoc(collection(db, 'bookings'), cleanBooking);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  onUserBookings(userId: string, role: 'customer' | 'professional', callback: (bookings: Booking[]) => void) {
    const path = 'bookings';
    const field = role === 'customer' ? 'customerId' : 'professionalId';
    const q = query(
      collection(db, 'bookings'), 
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    const path = `bookings/${bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async updateProfessionalStatus(uid: string, status: 'Available' | 'Busy'): Promise<void> {
    const path = `professionals/${uid}`;
    try {
      await updateDoc(doc(db, 'professionals', uid), { availabilityStatus: status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async updateProfessionalWorkingHours(uid: string, hours: string): Promise<void> {
    const path = `professionals/${uid}`;
    try {
      await updateDoc(doc(db, 'professionals', uid), { workingHours: hours });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Messages
  async sendMessage(msg: Omit<Message, 'id'>): Promise<void> {
    const path = 'messages';
    try {
      await addDoc(collection(db, 'messages'), {
        ...msg,
        isRead: false,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async markMessagesAsRead(bookingId: string, userId: string): Promise<void> {
    const path = 'messages';
    try {
      const q = query(
        collection(db, 'messages'),
        where('bookingId', '==', bookingId),
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      );
      const snapshot = await getDocs(q);
      const promises = snapshot.docs.map(doc => updateDoc(doc.ref, { isRead: true }));
      await Promise.all(promises);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  onBookingMessages(bookingId: string, callback: (messages: Message[]) => void) {
    const path = 'messages';
    const q = query(
      collection(db, 'messages'),
      where('bookingId', '==', bookingId),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
