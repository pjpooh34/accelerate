import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Crown } from "lucide-react";
import SEO from "@/components/layout/seo";
import { useAuth } from "@/components/auth/auth-context";

// Smart Pro button that routes based on user authentication status
function ProGetStartedButton() {
  const { user } = useAuth();
  
  if (!user) {
    // Not logged in -> direct to signup
    return (
      <Button asChild className="w-full">
        <Link href="/signup">
          <Crown className="w-4 h-4 mr-2" />
          Get Started with Pro
        </Link>
      </Button>
    );
  }
  
  if (user.subscriptionStatus === "active") {
    // Already Pro user -> go to dashboard
    return (
      <Button asChild className="w-full" variant="outline">
        <Link href="/dashboard">
          <Crown className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Link>
      </Button>
    );
  }
  
  // Logged in but free plan -> upgrade to Pro
  return (
    <Button asChild className="w-full">
      <Link href="/subscribe">
        <Crown className="w-4 h-4 mr-2" />
        Upgrade to Pro
      </Link>
    </Button>
  );
}

// Smart CTA button for hero section
function HeroCTAButton() {
  const { user } = useAuth();
  
  if (!user) {
    // Not logged in -> start free
    return (
      <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
        <Link href="/dashboard">Get Started for Free</Link>
      </Button>
    );
  }
  
  if (user.subscriptionStatus === "active") {
    // Already Pro user -> go to dashboard
    return (
      <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
        <Link href="/dashboard">Go to Pro Dashboard</Link>
      </Button>
    );
  }
  
  // Logged in but free plan -> upgrade to Pro
  return (
    <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
      <Link href="/subscribe">Upgrade to Pro</Link>
    </Button>
  );
}

export default function Landing() {
  return (
    <div className="flex flex-col">
      <SEO 
        title="Get Content AI - AI-Powered Content Creation for Social Media"
        description="Create engaging, platform-optimized content for Instagram, Twitter, LinkedIn and more in seconds. AI-powered tools to boost your social media presence."
        keywords="social media content, AI content generator, social media marketing, content creation, Instagram posts, Twitter content"
      />
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI-Powered Content<br />
                for Social Media
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Create engaging, platform-optimized content for all your social media channels in seconds, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link href="/dashboard">Start Creating</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30"></div>
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          AI
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">Get Content AI Assistant</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                      Looking for creative Instagram content ideas for a coffee shop that will increase engagement?
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg text-sm">
                      <p className="font-medium mb-2 text-slate-900 dark:text-white">Here are 3 engaging content ideas:</p>
                      <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                        <li>📸 "Behind-the-Beans" series showing your sourcing process</li>
                        <li>☕ Weekly latte art competitions with customer voting</li>
                        <li>🌱 Sustainability stories highlighting eco-friendly practices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Get Content AI?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our AI-powered platform helps you create better content faster, with features designed for social media professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h2" />
                  <path d="M8 17h2" />
                  <path d="M14 13h2" />
                  <path d="M14 17h2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Platform Optimization</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get content tailored specifically for each social platform, ensuring maximum engagement and performance.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Multiple Variations</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Generate multiple content options for every prompt, giving you choices to find the perfect fit for your audience.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Tone Customization</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Adjust the tone and style of your content to match your brand voice, from professional to casual and everything in between.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs, with no hidden fees or complicated pricing structures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 relative">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">Perfect for trying out the platform.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">5 content generations per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">OpenAI GPT-3.5 & GPT-4.0</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Claude 3.7 Sonnet</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">2 content variations</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Start Free</Link>
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border-2 border-primary relative transform scale-105 z-10">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-semibold py-1 px-3 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$29</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">For individual creators and small businesses.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Unlimited content generations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>OpenAI GPT-4.5 Turbo</strong> (Latest)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300"><strong>Claude 4.0</strong> (Latest)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">5 content variations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Content history & organization</span>
                </li>
              </ul>
              <ProGetStartedButton />
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 relative">
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">$99</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">For teams and larger businesses.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Team collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">10 content variations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">Priority support</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Social Media?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-white/90">
            Join thousands of creators and businesses who are saving time and creating better content with Get Content AI.
          </p>
          <HeroCTAButton />
        </div>
      </section>
    </div>
  );
}
