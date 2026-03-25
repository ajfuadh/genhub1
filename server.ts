import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const adminApp = admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);

// Email Transporter (Using a simulated real integration for this environment)
// In a production app, you would use environment variables for SMTP_HOST, SMTP_USER, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "test@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
});

async function sendCancellationEmail(customerEmail: string, bookingId: string, service: string, reason: string) {
  try {
    const info = await transporter.sendMail({
      from: '"GenHub Support" <support@genhub.app>',
      to: customerEmail,
      subject: `Appointment Cancelled: ${service}`,
      text: `Your appointment for ${service} (ID: ${bookingId}) has been cancelled by the professional.\n\nReason: ${reason}\n\nWe apologize for any inconvenience.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f43f5e;">Appointment Cancelled</h2>
          <p>Your appointment for <strong>${service}</strong> (ID: ${bookingId}) has been cancelled by the professional.</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Reason for Cancellation:</p>
            <p style="margin: 5px 0 0 0; color: #b91c1c;">${reason}</p>
          </div>
          <p>We apologize for any inconvenience this may cause. You can book another professional through the GenHub app.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated notification from GenHub.</p>
        </div>
      `,
    });
    console.log("Cancellation email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
    return false;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for connected clients
  const clients = new Map<string, WebSocket>();

  // API Routes
  app.post("/api/bookings/create", (req, res) => {
    const { professionalId, customerName, serviceType, date } = req.body;
    
    // Simulate booking creation
    const booking = {
      id: `BK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      professionalId,
      customerName,
      serviceType,
      date,
      status: "Pending",
      timestamp: new Date().toISOString()
    };

    // Notify the professional if they are online
    const professionalWs = clients.get(professionalId);
    if (professionalWs && professionalWs.readyState === WebSocket.OPEN) {
      professionalWs.send(JSON.stringify({
        type: "NEW_BOOKING",
        data: booking,
        message: `New booking request from ${customerName} for ${serviceType}`
      }));
    }

    res.json({ success: true, booking });
  });

  app.post("/api/bookings/cancel", async (req, res) => {
    const { bookingId, professionalId, reason, cancelledBy } = req.body;

    // 1. Notify the professional if they are online (via WebSocket)
    const professionalWs = clients.get(professionalId);
    if (professionalWs && professionalWs.readyState === WebSocket.OPEN) {
      professionalWs.send(JSON.stringify({
        type: "BOOKING_CANCELLED",
        data: { 
          bookingId, 
          reason: reason || "No reason provided",
          cancelledBy: cancelledBy || "User",
          timestamp: new Date().toISOString()
        },
        message: `Booking ${bookingId} has been cancelled by ${cancelledBy || "User"}: ${reason || "No reason provided"}`
      }));
    }

    // 2. Fetch booking details and customer email to send confirmation
    if (cancelledBy === "Professional") {
      try {
        const bookingDoc = await db.collection("bookings").doc(bookingId).get();
        if (bookingDoc.exists) {
          const bookingData = bookingDoc.data();
          const customerId = bookingData?.customerId;
          const service = bookingData?.service || "Service";

          if (customerId) {
            const userDoc = await db.collection("users").doc(customerId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              const customerEmail = userData?.email;

              if (customerEmail) {
                await sendCancellationEmail(
                  customerEmail, 
                  bookingId, 
                  service, 
                  reason || "Cancelled by professional"
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("Error processing cancellation email:", err);
      }
    }

    res.json({ success: true });
  });

  app.post("/api/messages/send", (req, res) => {
    const { professionalId, senderName, content } = req.body;

    // Notify the professional if they are online
    const professionalWs = clients.get(professionalId);
    if (professionalWs && professionalWs.readyState === WebSocket.OPEN) {
      professionalWs.send(JSON.stringify({
        type: "NEW_MESSAGE",
        data: { senderName, content },
        message: `New message from ${senderName}: "${content.substring(0, 30)}..."`
      }));
    }

    res.json({ success: true });
  });

  app.post("/api/payments/process", (req, res) => {
    const { amount, cardNumber, professionalId } = req.body;

    // Simulate a secure payment processing delay
    setTimeout(() => {
      // Basic validation simulation
      if (!cardNumber || cardNumber.length < 16) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid card details. Please check your card number." 
        });
      }

      // Simulate a successful transaction
      res.json({ 
        success: true, 
        transactionId: `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        amount,
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });

  // WebSocket Server with a specific path to avoid conflicts
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      // Let other handlers (like Vite) handle other upgrades if necessary
      // Though in this setup, we only expect our WS on /ws
    }
  });

  wss.on("connection", (ws, req) => {
    console.log(`New WebSocket connection from ${req.socket.remoteAddress}`);
    let currentProfessionalId: string | null = null;
    let isAlive = true;

    ws.on('pong', () => {
      isAlive = true;
    });
    
    ws.on("message", (message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log("Received WS message:", payload.type);
        
        if (payload.type === "REGISTER") {
          currentProfessionalId = payload.professionalId;
          if (currentProfessionalId) {
            clients.set(currentProfessionalId, ws);
            console.log(`Professional ${currentProfessionalId} registered`);
            
            // Send a confirmation message
            ws.send(JSON.stringify({ 
              type: "REGISTRATION_SUCCESS", 
              message: "You are now connected for real-time notifications." 
            }));

            // Simulate a status update for the professional after a few seconds
            // if they are tracking a booking (just for demo purposes)
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "STATUS_UPDATE",
                  status: "En Route",
                  location: { lat: 12.9716 + (Math.random() - 0.5) * 0.01, lng: 77.5946 + (Math.random() - 0.5) * 0.01 },
                  timestamp: new Date().toISOString()
                }));
              }
            }, 5000);
          }
        } else if (payload.type === "TYPING_STATUS") {
          const { receiverId, isTyping, bookingId } = payload;
          const receiverWs = clients.get(receiverId);
          if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
            receiverWs.send(JSON.stringify({
              type: "TYPING_STATUS",
              data: { senderId: currentProfessionalId, isTyping, bookingId }
            }));
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      if (currentProfessionalId) {
        clients.delete(currentProfessionalId);
        console.log(`Professional ${currentProfessionalId} disconnected`);
      }
      isAlive = false;
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Heartbeat interval
    const interval = setInterval(() => {
      if (isAlive === false) return ws.terminate();
      isAlive = false;
      ws.ping();
    }, 30000);

    ws.on('close', () => clearInterval(interval));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`GenHub Server running on http://localhost:${PORT}`);
  });
}

startServer();
