import SEO from "@/components/layout/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Shield, CreditCard, AlertTriangle, Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title="Terms of Service | Get Content AI"
        description="Read Get Content AI's terms of service and user agreement. Understand your rights and responsibilities when using our AI-powered content generation platform."
        keywords="terms of service, user agreement, get content ai terms, legal agreement, content generation terms"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using Get Content AI. By using our service, you agree to these terms.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: May 23, 2025
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                These Terms of Service ("Terms") govern your use of the Get Content AI platform ("Service") operated by Get Content AI ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="w-6 h-6 mr-3 text-green-600" />
                Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>
                Get Content AI is an artificial intelligence-powered platform that generates social media content for various platforms including Instagram, Twitter, Facebook, and LinkedIn. Our Service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered content generation using advanced language models</li>
                <li>Platform-specific content optimization and formatting</li>
                <li>Content history and management tools</li>
                <li>Image generation and upload capabilities</li>
                <li>Social media sharing integration</li>
                <li>User account management and billing services</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice to users.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="w-6 h-6 mr-3 text-purple-600" />
                User Accounts and Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Creation</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must be at least 16 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Security</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You are responsible for maintaining the confidentiality of your password</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We are not liable for any loss resulting from unauthorized account access</li>
                  <li>You may not share your account credentials with others</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Acceptable Use</h3>
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Generate content that is illegal, harmful, threatening, abusive, or defamatory</li>
                  <li>Create content that infringes on intellectual property rights</li>
                  <li>Use the Service to spam or send unsolicited communications</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the Service to compete with or create a similar service</li>
                  <li>Generate content that promotes violence, hatred, or discrimination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Subscription and Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <CreditCard className="w-6 h-6 mr-3 text-orange-600" />
                Subscription and Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Free and Paid Plans</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We offer both free and paid subscription plans</li>
                  <li>Free plans have usage limitations as specified on our website</li>
                  <li>Paid plans provide additional features and higher usage limits</li>
                  <li>Plan features and pricing are subject to change with notice</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Billing and Payments</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Subscription fees are billed in advance on a monthly basis</li>
                  <li>All payments are processed securely through Stripe</li>
                  <li>Fees are non-refundable except as required by law or our refund policy</li>
                  <li>We offer a 30-day money-back guarantee for new Pro subscriptions</li>
                  <li>Failure to pay fees may result in account suspension or termination</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Cancellation</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You may cancel your subscription at any time from your account settings</li>
                  <li>Cancellation takes effect at the end of your current billing period</li>
                  <li>You will retain access to paid features until the end of your billing period</li>
                  <li>No partial refunds are provided for unused portions of subscription periods</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Scale className="w-6 h-6 mr-3 text-indigo-600" />
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Your Content</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You retain ownership of content you create using our Service</li>
                  <li>You grant us a limited license to process and store your content to provide the Service</li>
                  <li>You are responsible for ensuring you have rights to any content you input</li>
                  <li>You represent that your use of generated content does not infringe third-party rights</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Our Service</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>The Service, including all software, algorithms, and technology, is owned by us</li>
                  <li>You may not copy, modify, distribute, or reverse engineer our Service</li>
                  <li>Our trademarks and logos may not be used without permission</li>
                  <li>These Terms do not grant you any ownership rights in our Service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">AI-Generated Content</h3>
                <p>
                  Content generated by our AI models is provided as-is. While you own the generated content, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>AI may occasionally generate content similar to existing works</li>
                  <li>You are responsible for reviewing content before use</li>
                  <li>We do not guarantee the originality of all generated content</li>
                  <li>You should verify that generated content meets your needs and standards</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using our Service, you consent to the collection, use, and sharing of your information as described in our Privacy Policy. We are committed to protecting your data and maintaining transparency about our data practices.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Service Availability</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
                  <li>Scheduled maintenance may temporarily interrupt service</li>
                  <li>We are not liable for service interruptions beyond our control</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Content Quality</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>AI-generated content is provided "as is" without warranties</li>
                  <li>We do not guarantee the accuracy or suitability of generated content</li>
                  <li>Users are responsible for reviewing and editing content before use</li>
                  <li>Results may vary based on input quality and AI model limitations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Get Content AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Termination by You</h3>
                <p>You may terminate your account at any time by contacting us or using the account deletion feature in your settings.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Termination by Us</h3>
                <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Violates these Terms or our policies</li>
                  <li>Is harmful to other users or our Service</li>
                  <li>Exposes us or other users to legal liability</li>
                  <li>Is fraudulent or involves unauthorized payments</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Effect of Termination</h3>
                <p>Upon termination, your right to use the Service will cease immediately. We may delete your account and all associated data within 30 days of termination.</p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service at least 30 days before the changes take effect.
              </p>
              <p>
                Your continued use of the Service after changes become effective constitutes acceptance of the new Terms. If you do not agree to the changes, you must stop using the Service and may terminate your account.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                These Terms are governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service will be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:legal@getcontentai.com" className="text-blue-600 hover:underline">legal@getcontentai.com</a></p>
                <p><strong>Support:</strong> <a href="mailto:support@getcontentai.com" className="text-blue-600 hover:underline">support@getcontentai.com</a></p>
                <p><strong>Address:</strong> Get Content AI, 1234 Innovation Drive, Tech Valley, CA 94000, United States</p>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgment */}
          <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="text-center py-8">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                By using Get Content AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Thank you for choosing Get Content AI for your content creation needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}