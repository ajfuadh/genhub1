import React, { useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import { Bell, MessageSquare, Calendar, XCircle } from 'lucide-react';
import { dataService } from '../services/dataService';

interface NotificationManagerProps {
  professionalId: string | null;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ professionalId }) => {
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission();
    }
  }, []);

  const showPushNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: '/favicon.ico' // Default icon
      });
    }
  }, []);

  useEffect(() => {
    if (!professionalId) return;

    requestNotificationPermission();

    // Listen for new bookings in Firestore as a fallback/primary for real-time
    const unsubscribe = dataService.onUserBookings(professionalId, 'professional', (bookings) => {
      // Find the most recent booking
      const latestBooking = bookings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      if (latestBooking && latestBooking.status === 'Confirmed') {
        // Check if it's "new" (e.g., created in the last 10 seconds)
        const isNew = (Date.now() - new Date(latestBooking.createdAt).getTime()) < 10000;
        if (isNew) {
          toast("New Booking Confirmed", {
            description: `You have a new ${latestBooking.service} booking!`,
            icon: <Calendar className="w-5 h-5 text-emerald-500" />,
            duration: 5000,
          });
          if (document.visibilityState === 'hidden') {
            showPushNotification("New Booking", `You have a new ${latestBooking.service} booking!`);
          }
        }
      }
    });

    // WebSocket logic remains for other real-time events if backend is present
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      console.log('Attempting WebSocket connection to:', wsUrl);
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'REGISTER',
            professionalId
          }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('Received notification:', payload);

          if (payload.type === 'REGISTRATION_SUCCESS') {
            console.log('Registered for notifications');
            return;
          }

          let icon = <Bell className="w-5 h-5 text-primary" />;
          let title = "Notification";

          switch (payload.type) {
            case 'NEW_BOOKING':
              icon = <Calendar className="w-5 h-5 text-emerald-500" />;
              title = "New Booking Request";
              break;
            case 'BOOKING_CANCELLED':
              icon = <XCircle className="w-5 h-5 text-error" />;
              title = "Booking Cancelled";
              break;
            case 'NEW_MESSAGE':
              icon = <MessageSquare className="w-5 h-5 text-secondary" />;
              title = "New Message";
              break;
          }

          toast(title, {
            description: payload.message,
            icon: icon,
            duration: 5000,
          });

          if (document.visibilityState === 'hidden') {
            showPushNotification(title, payload.message);
          }
        } catch (err) {
          console.error('Error parsing notification:', err);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket disconnected (code: ${event.code}). Reconnecting in 5s...`);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error occurred:', error);
      };
    };

    connect();

    return () => {
      if (socket) {
        socket.onclose = null; // Prevent reconnection on intentional close
        socket.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [professionalId, requestNotificationPermission, showPushNotification]);

  return <Toaster position="top-right" richColors />;
};
