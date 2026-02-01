import { Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-sage-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-forest flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sage-900 font-display">
                Terms of Service
              </h1>
              <p className="text-sage-600 text-sm">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-sage max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using GreenSentinel, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              GreenSentinel is an environmental compliance reporting platform that allows
              citizens to report environmental issues, track their resolution, and access
              environmental data.
            </p>

            <h2>3. User Responsibilities</h2>
            <ul>
              <li>Provide accurate and truthful information in reports</li>
              <li>Do not submit false or misleading reports</li>
              <li>Respect the privacy of others</li>
              <li>Do not use the platform for illegal activities</li>
            </ul>

            <h2>4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand
              how we collect, use, and protect your information.
            </p>

            <h2>5. Subscription and Payments</h2>
            <p>
              Some features require a paid subscription. All payments are processed securely
              through Razorpay. Subscriptions can be cancelled at any time.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              GreenSentinel is provided as is without warranties of any kind. We are not
              liable for any damages arising from the use of our service.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>

            <h2>8. Contact</h2>
            <p>
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@greensentinel.in">legal@greensentinel.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}