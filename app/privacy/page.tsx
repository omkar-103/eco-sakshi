import { Leaf, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
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
            <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-ocean-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sage-900 font-display">Privacy Policy</h1>
              <p className="text-sage-600 text-sm">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-sage max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email address from Google Sign-In
              </li>
              <li>
                <strong>Report Data:</strong> Location, photos, descriptions of environmental issues
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with our platform
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>Process and track environmental reports</li>
              <li>Communicate with you about report status</li>
              <li>Improve our services</li>
              <li>Provide anonymized data for research purposes</li>
            </ul>

            <h2>3. Data Sharing</h2>
            <p>We share data with:</p>
            <ul>
              <li>Government authorities for report resolution</li>
              <li>NGOs for research (anonymized data only)</li>
              <li>Service providers who help us operate the platform</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data,
              including encryption, secure servers, and regular security audits.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies to maintain your session and improve user experience. You can
              control cookie settings through your browser.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:privacy@greensentinel.in">privacy@greensentinel.in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}