import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Profile from "@/pages/profile";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/components/auth/auth-context";
import { CurrencyProvider } from "@/hooks/use-currency";
import Templates from "./pages/templates";
import Settings from "./pages/settings";
import History from "./pages/history";
import SavedContent from "./pages/saved-content";
import Subscribe from "./pages/subscribe";
import Help from "./pages/help";
import About from "./pages/about";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Trends from "./pages/trends";
import Performance from "./pages/performance";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Get Content AI - AI-Powered Social Media Content Generator | Create Viral Posts with GPT-4 & Claude</title>
        <meta name="description" content="Generate engaging social media content with AI in seconds. Create viral posts for Instagram, Twitter, Facebook & LinkedIn using GPT-4, Claude AI. Free trial available!" />
        <meta name="keywords" content="AI content generator, social media content creator, AI writing tool, viral content generator, Instagram post generator, Twitter content AI, Facebook post creator, LinkedIn content writer, GPT-4 content, Claude AI writing, social media marketing tools, content creation software, AI copywriting, automated content creation, social media automation" />
        <meta name="author" content="Get Content AI" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getcontentai.com/" />
        <meta property="og:title" content="Get Content AI - Create Viral Social Media Content with AI" />
        <meta property="og:description" content="Generate engaging social media content with AI in seconds. Create viral posts for Instagram, Twitter, Facebook & LinkedIn using GPT-4 & Claude AI." />
        <meta property="og:image" content="https://getcontentai.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Get Content AI" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://getcontentai.com/" />
        <meta name="twitter:title" content="Get Content AI - Create Viral Social Media Content with AI" />
        <meta name="twitter:description" content="Generate engaging social media content with AI in seconds. Create viral posts for Instagram, Twitter, Facebook & LinkedIn using GPT-4 & Claude AI." />
        <meta name="twitter:image" content="https://getcontentai.com/og-image.png" />
        <meta name="twitter:creator" content="@getcontentai" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://getcontentai.com/" />
        
        {/* Alternate languages */}
        <link rel="alternate" hrefLang="en" href="https://getcontentai.com/" />
        <link rel="alternate" hrefLang="es" href="https://getcontentai.com/?lang=es" />
        <link rel="alternate" hrefLang="fr" href="https://getcontentai.com/?lang=fr" />
        <link rel="alternate" hrefLang="pt" href="https://getcontentai.com/?lang=pt" />
        <link rel="alternate" hrefLang="ko" href="https://getcontentai.com/?lang=ko" />
        <link rel="alternate" hrefLang="zh" href="https://getcontentai.com/?lang=zh" />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Get Content AI",
            "url": "https://getcontentai.com",
            "logo": "https://getcontentai.com/logo.png",
            "description": "AI-powered social media content generator for creating engaging posts across multiple platforms",
            "foundingDate": "2025",
            "sameAs": [
              "https://twitter.com/getcontentai",
              "https://facebook.com/getcontentai",
              "https://linkedin.com/company/getcontentai"
            ]
          })}
        </script>
        
        {/* Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Get Content AI",
            "description": "AI-powered social media content generator for creating engaging posts across multiple platforms using GPT-4 and Claude AI",
            "url": "https://getcontentai.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "browserRequirements": "Modern web browser with JavaScript enabled",
            "offers": [
              {
                "@type": "Offer",
                "name": "Free Plan",
                "price": "0",
                "priceCurrency": "USD",
                "description": "5 AI generations per month with basic features"
              },
              {
                "@type": "Offer",
                "name": "Pro Plan",
                "price": "29.00",
                "priceCurrency": "USD",
                "billingDuration": "P1M",
                "description": "Unlimited AI content generation with premium GPT-4 and Claude models"
              }
            ],
            "featureList": [
              "AI Content Generation",
              "Multi-platform optimization",
              "Trend analysis",
              "Viral content prediction",
              "Image generation",
              "Multi-language support"
            ]
          })}
        </script>
        
        {/* Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Get Content AI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Get Content AI is an advanced AI-powered platform that generates engaging social media content for Instagram, Twitter, Facebook, and LinkedIn using state-of-the-art AI models like GPT-4 and Claude."
                }
              },
              {
                "@type": "Question",
                "name": "How does AI content generation work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI analyzes your topic, target audience, and platform requirements to create optimized content. We use advanced language models to generate authentic, engaging posts tailored to each social media platform's best practices."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a free trial?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We offer a free plan with 5 AI content generations per month. You can upgrade to our Pro plan for unlimited generations and access to premium AI models."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/templates" component={Templates} />
          <Route path="/settings" component={Settings} />
          <Route path="/history" component={History} />
          <Route path="/saved" component={SavedContent} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/help" component={Help} />
          <Route path="/trends" component={Trends} />
          <Route path="/performance" component={Performance} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
