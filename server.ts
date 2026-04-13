import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "firebase-applet-config.json"), "utf8"));

// Initialize Firebase Admin
// Note: In a real production environment, you'd use a service account key.
// Here we attempt to use the project ID from the config.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const firestore = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  let stripe: Stripe | null = null;
  const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required for this operation.");
    }
    if (!stripe) {
      stripe = new Stripe(key, {
        apiVersion: "2026-03-25.dahlia" as any,
      });
    }
    return stripe;
  };

  // Stripe Webhook handler (must be before express.json())
  app.post(
    "/api/webhook",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        if (!sig || !webhookSecret) {
          throw new Error("Missing stripe-signature or webhook secret");
        }
        const stripeInstance = getStripe();
        event = stripeInstance.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
          try {
            await firestore.collection("users").doc(userId).update({
              isPremium: true,
            });
            console.log(`User ${userId} upgraded to Pro via Webhook`);
          } catch (error) {
            console.error(`Error updating user ${userId}:`, error);
          }
        }
      }

      res.json({ received: true });
    }
  );

  app.use(express.json());

  // API Route to create Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    try {
      const stripeInstance = getStripe();
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Bilingual & Brilliant Pro",
                description: "Unlock all premium speech therapy tools and AI features.",
              },
              unit_amount: 999, // $9.99
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/?success=true`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/?canceled=true`,
        customer_email: userEmail,
        metadata: {
          userId: userId,
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
