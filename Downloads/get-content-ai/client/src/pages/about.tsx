import SEO from "@/components/layout/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Zap, Target, Award, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title="About Us | Get Content AI"
        description="Learn about Get Content AI's mission to democratize content creation through AI technology. Discover our story, values, and commitment to helping creators succeed."
        keywords="about get content ai, ai content creation company, social media automation, content generation platform"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            About Get Content AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing content creation by making professional, engaging social media content accessible to everyone through the power of artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl mb-4">
                <Target className="w-8 h-8 mr-3 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                To democratize content creation by providing powerful AI tools that help businesses, creators, and individuals produce high-quality social media content effortlessly. We believe everyone deserves access to professional-grade content creation, regardless of their budget or technical expertise.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl mb-4">
                <Brain className="w-8 h-8 mr-3 text-indigo-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                To become the world's leading AI-powered content creation platform, enabling millions of users to build their online presence with authentic, engaging content that drives real results and meaningful connections with their audiences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="mb-16 p-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-8">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Get Content AI was born from a simple observation: creating engaging social media content shouldn't be a barrier to success. Too many talented individuals and businesses struggle to maintain a consistent online presence simply because content creation is time-consuming, expensive, or technically challenging.
              </p>
              <p>
                Our founders, experienced in both technology and digital marketing, recognized that artificial intelligence could solve this problem. By combining cutting-edge AI models with deep understanding of social media dynamics, we created a platform that generates authentic, platform-optimized content in seconds.
              </p>
              <p>
                Today, Get Content AI serves thousands of users worldwide, from solo entrepreneurs to marketing teams at Fortune 500 companies. Our platform has generated millions of pieces of content, helping our users build stronger brands, engage larger audiences, and achieve their business goals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We continuously push the boundaries of what's possible with AI technology to deliver cutting-edge solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every feature we build is designed with our users' success in mind, ensuring intuitive and powerful experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Award className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We maintain the highest standards in our AI models and platform to deliver consistently excellent results.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Globe className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe powerful content creation tools should be accessible to everyone, regardless of technical skill level.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Brain className="w-12 h-12 mx-auto text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're open about how our AI works and committed to ethical, responsible AI development practices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <Target className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're obsessed with helping our users achieve real, measurable results in their content marketing efforts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Section */}
        <Card className="mb-16 p-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center mb-8">Our Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Get Content AI leverages state-of-the-art language models including OpenAI's GPT-4 and Anthropic's Claude to generate human-like, contextually relevant content. Our platform is built on modern web technologies ensuring fast, reliable performance at scale.
              </p>
              <p>
                We continuously train and fine-tune our AI models on the latest social media trends, platform-specific best practices, and successful content patterns to ensure our generated content performs well across all major social platforms.
              </p>
              <p>
                Our infrastructure is designed for reliability and security, with enterprise-grade data protection, 99.9% uptime, and SOC 2 compliance to keep your content and data safe.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-3xl mb-6">Get In Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Have questions about Get Content AI? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@getcontentai.com" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="mailto:partnerships@getcontentai.com" 
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Business Inquiries
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}