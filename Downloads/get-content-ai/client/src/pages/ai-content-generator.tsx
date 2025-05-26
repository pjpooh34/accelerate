import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Sparkles, ArrowRight, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function AIContentGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <Helmet>
        <title>AI Content Generator | Best AI Writing Tool for Social Media | Get Content AI</title>
        <meta name="description" content="The best AI content generator for creating viral social media posts. Generate engaging content for Instagram, Twitter, Facebook & LinkedIn with our advanced AI writing tool. Free trial available!" />
        <meta name="keywords" content="AI content generator, best AI writing tool, AI article writer, automated content creation, AI blog writer, social media content generator" />
        <link rel="canonical" href="https://getcontentai.com/ai-content-generator" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Content Generator",
            "description": "Advanced AI content generation service for social media platforms",
            "provider": {
              "@type": "Organization",
              "name": "Get Content AI"
            },
            "areaServed": "Worldwide",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Content Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Social Media Content Generation"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            The Best AI Content Generator for Social Media
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Create viral social media content in seconds with our advanced AI writing tool. 
            Generate engaging posts for Instagram, Twitter, Facebook, and LinkedIn using GPT-4 and Claude AI.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Start Creating Content <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Brain className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white text-xl">AI Content Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Advanced AI writing tool powered by GPT-4 and Claude AI creates authentic, 
                engaging content tailored to your brand voice.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Zap className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white text-xl">Automated Content Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Generate hundreds of posts in minutes with our automated content creation system. 
                Perfect for busy marketers and content creators.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Sparkles className="w-12 h-12 text-pink-400 mb-4" />
              <CardTitle className="text-white text-xl">AI Article Writer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Our AI article writer creates long-form content, blog posts, and detailed 
                social media captions that engage your audience.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Why Choose Our AI Writing Tool?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center text-white">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg">Generate content 10x faster than manual writing</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg">Platform-optimized for maximum engagement</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg">AI blog writer for long-form content</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg">Best AI writing tool for social media</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl mb-4">
                Ready to Transform Your Content Strategy?
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Join thousands of creators using the best AI content generator for social media success.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg w-full">
                  Start Your Free Trial <Star className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}