import SEO from "@/components/layout/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <SEO 
        title="Privacy Policy | Get Content AI"
        description="Learn how Get Content AI protects your privacy and handles your data. Our comprehensive privacy policy explains data collection, usage, and your rights."
        keywords="privacy policy, data protection, get content ai privacy, user data security"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is fundamental to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: May 23, 2025
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                Get Content AI ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered content generation platform.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Database className="w-6 h-6 mr-3 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Account information (username, email address, password)</li>
                  <li>Profile information (display name, profile picture)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Communication preferences and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Content generation requests and preferences</li>
                  <li>Platform usage statistics and feature interactions</li>
                  <li>Generated content history and saved items</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Log files, including access times and pages viewed</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Analytics data to improve our services</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Eye className="w-6 h-6 mr-3 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our AI content generation services</li>
                <li><strong>Account Management:</strong> To create and manage your account, process payments, and provide customer support</li>
                <li><strong>Personalization:</strong> To customize your experience and improve content generation relevance</li>
                <li><strong>Communication:</strong> To send you service updates, security alerts, and marketing communications (with your consent)</li>
                <li><strong>Analytics:</strong> To understand how our service is used and to improve performance and features</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights and those of our users</li>
                <li><strong>Security:</strong> To detect, prevent, and respond to fraud, abuse, and security threats</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="w-6 h-6 mr-3 text-orange-600" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Service Providers</h3>
                <p>We work with trusted third-party service providers who assist us in operating our platform:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Payment processing (Stripe) - for secure payment handling</li>
                  <li>Cloud hosting (AWS/Google Cloud) - for reliable service delivery</li>
                  <li>Analytics providers - for service improvement insights</li>
                  <li>Customer support tools - for better user assistance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Legal Requirements</h3>
                <p>We may disclose your information when required by law or to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Comply with legal processes or government requests</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or security threats</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, with prior notice to users.</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Lock className="w-6 h-6 mr-3 text-red-600" />
                Data Security and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>We implement industry-standard security measures to protect your personal information:</p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication for our systems</li>
                <li><strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
                <li><strong>SOC 2 Compliance:</strong> We maintain SOC 2 Type II certification</li>
                <li><strong>Data Minimization:</strong> We collect only the data necessary for our services</li>
                <li><strong>Secure Infrastructure:</strong> Enterprise-grade cloud infrastructure with 99.9% uptime</li>
              </ul>

              <p className="mt-4">
                While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We continuously work to improve our security measures and promptly address any identified vulnerabilities.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights and Choices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="w-6 h-6 mr-3 text-indigo-600" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>You have the following rights regarding your personal information:</p>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Access and Portability</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Request access to your personal data</li>
                  <li>Export your content and data in a portable format</li>
                  <li>Receive information about how your data is processed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Correction and Deletion</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Update or correct your personal information</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Communication Preferences</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Opt out of marketing communications</li>
                  <li>Control notification settings</li>
                  <li>Manage cookie preferences</li>
                </ul>
              </div>

              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@getcontentai.com" className="text-blue-600 hover:underline">privacy@getcontentai.com</a>. We will respond to your request within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our services through analytics</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards, including standard contractual clauses and adequacy decisions.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For significant changes, we may also send you an email notification. Your continued use of our service after such modifications constitutes acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@getcontentai.com" className="text-blue-600 hover:underline">privacy@getcontentai.com</a></p>
                <p><strong>Support:</strong> <a href="mailto:support@getcontentai.com" className="text-blue-600 hover:underline">support@getcontentai.com</a></p>
                <p><strong>Address:</strong> Get Content AI, 1234 Innovation Drive, Tech Valley, CA 94000, United States</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}