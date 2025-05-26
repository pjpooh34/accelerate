import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { 
  generateSocialContent, 
  generateMoreVariations 
} from "./ai-service";
import { postToSocialMedia, type PostContent } from "./social-media-api";
import * as trendPredictor from "./trend-predictor";
import * as performancePredictor from "./performance-predictor";
import { 
  generateContentSchema, 
  generateMoreVariationsSchema,
  saveContentSchema,
  unsaveContentSchema,
  subscriptionPlanSchema,
  updateUserPreferencesSchema,
  postToSocialMediaSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { authController, isAuthenticated } from "./auth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      // Create a payment intent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      
      // Send the client secret to the client
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe webhook endpoint
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as any;
        const userId = subscription.metadata.userId;
        if (userId) {
          await storage.updateSubscriptionStatus(parseInt(userId), subscription.status);
        }
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as any;
        const deletedUserId = deletedSubscription.metadata.userId;
        if (deletedUserId) {
          await storage.updateSubscriptionStatus(parseInt(deletedUserId), 'canceled');
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // Pro subscription endpoint  
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      let user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          if (subscription.status === 'active') {
            return res.json({
              subscriptionId: subscription.id,
              clientSecret: null,
              alreadySubscribed: true,
              status: 'active'
            });
          }
        } catch (error) {
          console.log('Existing subscription not found, creating new one');
        }
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || `${user.username}@temp.local`,
          name: user.username,
          metadata: {
            userId: user.id.toString()
          }
        });
        customerId = customer.id;
        user = await storage.updateStripeCustomerId(user.id, customerId);
      }

      // Use the configured Stripe Price ID for Pro Plan
      const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1RRwXbCBvWyiQcuHbKNiwifd';

      // Create subscription with the price ID
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: STRIPE_PRICE_ID,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: user.id.toString(),
        },
      });

      // Update user with subscription info
      await storage.updateUserStripeInfo(user.id, {
        customerId: customerId,
        subscriptionId: subscription.id
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent;

      console.log('Subscription created successfully:', subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        status: subscription.status,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return res.status(500).json({ error: error.message || 'Failed to create subscription' });
    }
  });

  // Update user preferences endpoint
  app.post('/api/user/preferences', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = updateUserPreferencesSchema.parse(req.body);
      const session = req.session as any;
      const userId = session?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const updatedUser = await storage.updateUserPreferences(userId, validatedData);
      res.json({ success: true, user: updatedUser });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Auth routes
  app.post("/api/auth/signup", authController.register);
  app.post("/api/auth/login", authController.login);
  app.post("/api/auth/google", authController.googleAuth);
  app.get("/api/auth/me", authController.getCurrentUser);
  app.post("/api/auth/profile", isAuthenticated, authController.updateProfile);
  app.post("/api/auth/logout", authController.logout);
  
  // Generate content endpoint
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const validatedData = generateContentSchema.parse(req.body);
      
      // Check usage limits
      const session = req.session as any;
      const userId = session?.userId;
      
      if (!userId) {
        // Guest users: limit to 1 generation
        const guestUsageKey = `guest_usage_${req.ip}`;
        if (session[guestUsageKey] >= 1) {
          return res.status(429).json({ 
            error: "Guest limit reached. Please create an account to continue generating content.",
            requiresSignup: true
          });
        }
        session[guestUsageKey] = (session[guestUsageKey] || 0) + 1;
      } else {
        // Authenticated users: check their usage limits
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        
        // Check if user is on Pro plan
        if (user.subscriptionStatus !== "active") {
          // Free plan: limit to 5 generations
          if (user.aiUsageCount >= 5) {
            return res.status(429).json({ 
              error: "Free plan limit reached (5/5 generations). Upgrade to Pro for unlimited content generation.",
              requiresUpgrade: true,
              usageCount: user.aiUsageCount,
              usageLimit: 5
            });
          }
        }
        
        // Increment usage count for authenticated users
        await storage.incrementAiUsage(userId);
      }
      
      const result = await generateSocialContent(
        validatedData.prompt || validatedData.topic,
        validatedData.platform,
        validatedData.contentType,
        validatedData.targetAudience || validatedData.audience || "",
        validatedData.advancedOptions || {}
      );
      
      const contentId = await storage.createContent({
        title: result.mainContent.title,
        content: result.mainContent.content,
        platform: validatedData.platform,
        contentType: validatedData.contentType,
        userId: userId || null,
      });
      
      res.json(result);
      
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content" });
      }
    }
  });
  
  // Generate more variations endpoint
  app.post("/api/generate/more", async (req: Request, res: Response) => {
    try {
      const validatedData = generateMoreVariationsSchema.parse(req.body);
      
      const result = await generateMoreVariations(
        validatedData.platform,
        validatedData.contentType,
        validatedData.baseContent,
        validatedData.advancedOptions
      );
      
      res.json(result);
      
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error generating variations:", error);
        res.status(500).json({ message: "Failed to generate more variations" });
      }
    }
  });
  
  // Get content history endpoint
  app.get("/api/content", async (req: Request, res: Response) => {
    try {
      const contents = await storage.getAllContent();
      res.json(contents);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content history" });
    }
  });
  
  // Get user content history endpoint (protected)
  app.get("/api/user/content", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const contents = await storage.getUserContent(userId);
      res.json(contents);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Failed to fetch user content history" });
    }
  });
  
  // Save content to favorites
  app.post("/api/content/save", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const data = saveContentSchema.parse(req.body);
      const userId = (req.session as any).userId;
      
      await storage.saveContent(userId, data.contentId);
      
      res.json({ success: true, message: "Content saved successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error saving content:", error);
        res.status(500).json({ message: "Failed to save content" });
      }
    }
  });
  
  // Get saved/favorited content
  app.get("/api/content/saved", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const savedContent = await storage.getSavedContent(userId);
      
      res.json(savedContent);
    } catch (error) {
      console.error("Error fetching saved content:", error);
      res.status(500).json({ message: "Failed to fetch saved content" });
    }
  });
  
  // Remove content from favorites
  app.post("/api/content/unsave", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const data = unsaveContentSchema.parse(req.body);
      const userId = (req.session as any).userId;
      
      await storage.unsaveContent(userId, data.contentId);
      
      res.json({ success: true, message: "Content removed from favorites" });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error removing from favorites:", error);
        res.status(500).json({ message: "Failed to remove content from favorites" });
      }
    }
  });

  // Auto-posting to social media platforms
  app.post("/api/content/post", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { contentId, platform, imageUrl } = postToSocialMediaSchema.parse(req.body);
      const user = (req as any).user;
      
      // Get the content to post
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      // Check if user owns this content
      if (content.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Prepare post content
      const postContent: PostContent = {
        text: content.content,
        imageUrl: imageUrl || content.imageUrl
      };
      
      // Post to the selected platform
      const result = await postToSocialMedia(platform as any, postContent);
      
      if (result.success) {
        res.json({
          success: true,
          postId: result.postId,
          platformUrl: result.platformUrl,
          message: `Successfully posted to ${platform}!`
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
          message: `Failed to post to ${platform}: ${result.error}`
        });
      }
      
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      console.error("Error posting to social media:", error);
      res.status(500).json({ message: "Failed to post to social media" });
    }
  });

  // AI Image Generation endpoint
  app.post("/api/generate-image", async (req: Request, res: Response) => {
    try {
      const { prompt, platform, dimensions } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Generate image using OpenAI DALL-E
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `${prompt}. Optimized for ${platform} social media platform.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(400).json({ 
          message: data.error?.message || "Failed to generate image" 
        });
      }

      res.json({
        success: true,
        imageUrl: data.data[0].url,
        platform,
        dimensions
      });

    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  // Trend Predictor Routes
  app.get("/api/trends", async (req: Request, res: Response) => {
    try {
      const { platform, industry, audience } = req.query;
      
      const trends = await trendPredictor.analyzeTrends(
        platform as string,
        industry as string,
        audience as string
      );
      
      res.json(trends);
    } catch (error: any) {
      console.error("Trend analysis error:", error);
      res.status(500).json({ message: "Failed to analyze trends: " + error.message });
    }
  });

  app.post("/api/trends/topic-score", async (req: Request, res: Response) => {
    try {
      const { topic, platform } = req.body;
      
      if (!topic || !platform) {
        return res.status(400).json({ message: "Topic and platform are required" });
      }
      
      const score = await trendPredictor.getTopicTrendScore(topic, platform);
      res.json(score);
    } catch (error: any) {
      console.error("Topic trend score error:", error);
      res.status(500).json({ message: "Failed to get topic score: " + error.message });
    }
  });

  app.post("/api/trends/viral-content", async (req: Request, res: Response) => {
    try {
      const { platform, trend } = req.body;
      
      if (!platform || !trend) {
        return res.status(400).json({ message: "Platform and trend data are required" });
      }
      
      const viralContent = await trendPredictor.suggestViralContent(platform, trend);
      res.json(viralContent);
    } catch (error: any) {
      console.error("Viral content suggestion error:", error);
      res.status(500).json({ message: "Failed to suggest viral content: " + error.message });
    }
  });

  // Performance Prediction Routes
  app.post("/api/performance/predict", async (req: Request, res: Response) => {
    try {
      const { content, platform, contentType, targetAudience, hashtags, postingTime, industry } = req.body;
      
      if (!content || !platform) {
        return res.status(400).json({ message: "Content and platform are required" });
      }
      
      const prediction = await performancePredictor.predictContentPerformance({
        content,
        platform,
        contentType: contentType || 'post',
        targetAudience,
        hashtags,
        postingTime,
        industry
      });
      
      res.json(prediction);
    } catch (error: any) {
      console.error("Performance prediction error:", error);
      res.status(500).json({ message: "Failed to predict content performance: " + error.message });
    }
  });

  app.post("/api/performance/compare", async (req: Request, res: Response) => {
    try {
      const { originalContent, improvedContent, platform } = req.body;
      
      if (!originalContent || !improvedContent || !platform) {
        return res.status(400).json({ message: "Original content, improved content, and platform are required" });
      }
      
      const comparison = await performancePredictor.compareContentVersions(
        originalContent,
        improvedContent,
        platform
      );
      
      res.json(comparison);
    } catch (error: any) {
      console.error("Content comparison error:", error);
      res.status(500).json({ message: "Failed to compare content versions: " + error.message });
    }
  });

  app.post("/api/performance/report", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const userContent = await storage.getUserContent(userId);
      
      const contentHistory = userContent.map(item => ({
        content: item.content,
        platform: item.platform,
        actualMetrics: null // Could be populated with real metrics if available
      }));
      
      const report = await performancePredictor.generatePerformanceReport(contentHistory);
      res.json(report);
    } catch (error: any) {
      console.error("Performance report error:", error);
      res.status(500).json({ message: "Failed to generate performance report: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
