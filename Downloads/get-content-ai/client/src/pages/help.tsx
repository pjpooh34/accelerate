import { useState } from "react";
import SEO from "@/components/layout/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Book, Zap, CreditCard, Shield, Users } from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Book className="w-5 h-5" />,
      questions: [
        {
          q: "How do I create my first piece of content?",
          a: "Simply go to your dashboard, select your target platform (Instagram, Twitter, Facebook, or LinkedIn), choose your content type, and describe what you want to create. Our AI will generate engaging content tailored to your platform and audience."
        },
        {
          q: "What social media platforms does Get Content AI support?",
          a: "We support all major social media platforms including Instagram, Twitter (X), Facebook, and LinkedIn. Each platform has optimized content generation that follows platform-specific best practices and character limits."
        },
        {
          q: "How accurate and relevant is the AI-generated content?",
          a: "Our AI uses advanced language models (GPT-4 and Claude) trained on current social media trends and best practices. The content is highly relevant and engaging, though we always recommend reviewing and personalizing it to match your brand voice."
        },
        {
          q: "Can I customize the tone and style of generated content?",
          a: "Absolutely! You can specify your target audience, tone (professional, casual, fun, etc.), and include specific keywords or topics. Our advanced options allow you to fine-tune creativity levels, content length, and style preferences."
        }
      ]
    },
    {
      title: "Features & Usage",
      icon: <Zap className="w-5 h-5" />,
      questions: [
        {
          q: "What's the difference between Free and Pro plans?",
          a: "Free users get 5 AI generations total with access to basic models. Pro users ($29/month) get unlimited generations, access to premium AI models (GPT-4, Claude), advanced customization options, priority support, and early access to new features."
        },
        {
          q: "How do I save and organize my generated content?",
          a: "All your generated content is automatically saved in your content history. You can also save specific pieces to your favorites for easy access later. Pro users get unlimited storage and advanced organization features."
        },
        {
          q: "Can I edit the generated content before posting?",
          a: "Yes! All generated content can be edited directly in the platform. You can modify text, adjust hashtags, and customize any part of the content before sharing it to your social media accounts."
        },
        {
          q: "How do I generate variations of the same content?",
          a: "After generating content, click 'Generate More Variations' to create additional versions of the same topic. This is perfect for A/B testing or having multiple options to choose from."
        },
        {
          q: "Does Get Content AI support image generation?",
          a: "Yes! Pro users can generate AI images using DALL-E 3, upload their own images, or choose from our stock photo library. Images are automatically optimized for each social media platform's dimensions."
        }
      ]
    },
    {
      title: "Account & Billing",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          q: "How do I upgrade to Pro?",
          a: "Go to your account settings or click 'Upgrade to Pro' from any page. You'll be taken to our secure checkout where you can enter your payment details. Your Pro features activate immediately after payment."
        },
        {
          q: "Can I cancel my Pro subscription anytime?",
          a: "Yes, you can cancel your Pro subscription at any time from your account settings. You'll retain Pro features until the end of your current billing period, then automatically revert to the Free plan."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure Stripe payment processing. We also support PayPal and bank transfers for annual subscriptions."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer a 30-day money-back guarantee for Pro subscriptions. If you're not satisfied within the first 30 days, contact our support team for a full refund."
        },
        {
          q: "How do I update my billing information?",
          a: "You can update your payment methods, billing address, and subscription details in your account settings under the 'Billing' section. Changes take effect immediately."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          q: "Is my data secure with Get Content AI?",
          a: "Yes, we take security seriously. All data is encrypted in transit and at rest, we're SOC 2 compliant, and we never store or access your social media login credentials. Your content and personal information are fully protected."
        },
        {
          q: "Do you share my generated content with anyone?",
          a: "Never. Your generated content is private and belongs to you. We don't share, sell, or use your content for any purpose other than providing our service to you."
        },
        {
          q: "How do you handle my personal information?",
          a: "We collect only the minimum information necessary to provide our service. We don't sell personal data to third parties and you can request data deletion at any time. See our Privacy Policy for complete details."
        },
        {
          q: "Can I delete my account and data?",
          a: "Yes, you can delete your account at any time from your account settings. This will permanently remove all your data, generated content, and personal information from our systems within 30 days."
        }
      ]
    },
    {
      title: "Troubleshooting",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: "Why is content generation taking a long time?",
          a: "Content generation usually takes 5-15 seconds. If it's taking longer, it might be due to high demand on our AI models. Try refreshing the page or generating content again. Pro users get priority processing for faster generation."
        },
        {
          q: "I'm getting an error when trying to generate content. What should I do?",
          a: "First, check your internet connection and try again. If the error persists, try logging out and back in. For continued issues, contact our support team with the specific error message you're seeing."
        },
        {
          q: "The generated content doesn't match what I requested. How can I improve it?",
          a: "Try being more specific in your content description, include relevant keywords, and specify your target audience and tone. Using the advanced options to adjust creativity levels and content style can also help get better results."
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. If you don't see it, check your spam folder."
        },
        {
          q: "Can I use Get Content AI on mobile devices?",
          a: "Yes! Our platform is fully responsive and works great on mobile devices and tablets. You can generate and manage content from anywhere using your mobile browser."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(item => 
      searchQuery === "" || 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title="Help Center | Get Content AI"
        description="Find answers to common questions about using Get Content AI. Learn how to create engaging social media content, manage your account, and get the most from our AI-powered platform."
        keywords="get content ai help, content generation guide, social media ai tutorial, content creation support"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about creating amazing content with Get Content AI
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent>
              <MessageCircle className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get personalized help from our support team
              </p>
              <Button variant="outline" className="w-full">
                <a href="mailto:support@getcontentai.com">Email Support</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent>
              <Book className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Watch step-by-step guides to master our platform
              </p>
              <Button variant="outline" className="w-full">
                <a href="https://youtube.com/@getcontentai" target="_blank" rel="noopener noreferrer">
                  Watch Tutorials
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent>
              <Users className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with other users and share tips
              </p>
              <Button variant="outline" className="w-full">
                <a href="https://community.getcontentai.com" target="_blank" rel="noopener noreferrer">
                  Join Community
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto">
          {filteredCategories.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent>
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try searching with different keywords or browse our categories below.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    {category.icon}
                    <span className="ml-3">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left text-lg font-medium hover:text-blue-600">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Still Need Help */}
        <Card className="max-w-2xl mx-auto mt-16 text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help you succeed with Get Content AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                <a href="mailto:support@getcontentai.com">Contact Support</a>
              </Button>
              <Button variant="outline">
                <a href="/about">Learn More About Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}