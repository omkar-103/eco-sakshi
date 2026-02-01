import Link from 'next/link';
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Public Reports', href: '/reports/public' },
    { label: 'Live Map', href: '/map/public' },
    { label: 'Track Report', href: '/track' },
    { label: 'Submit Report', href: '/login' },
    { label: 'Statistics', href: '/stats' },
  ],
  resources: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Report Categories', href: '/categories' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'FAQs', href: '/faq' },
    { label: 'API Access', href: '/api-docs' },
  ],
  organization: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press Kit', href: '/press' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Data Protection', href: '/data-protection' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/ecosakshi', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/ecosakshi', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/ecosakshi', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/ecosakshi', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@ecosakshi', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-sage-900 to-sage-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display">Eco Sakshi</span>
                <p className="text-xs text-sage-400 font-medium">Environmental Witness</p>
              </div>
            </Link>
            <p className="text-sage-300 text-sm leading-relaxed mb-6 max-w-sm">
              India's citizen-driven environmental compliance network. Witness, document, 
              and trigger action against environmental violations.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:contact@ecosakshi.in" 
                className="flex items-center gap-3 text-sage-300 hover:text-forest-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                contact@ecosakshi.in
              </a>
              <a 
                href="tel:+911234567890" 
                className="flex items-center gap-3 text-sage-300 hover:text-forest-400 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +91 12345 67890
              </a>
              <div className="flex items-start gap-3 text-sage-300 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-forest-500 flex items-center justify-center text-sage-400 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-400 hover:text-forest-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-400 hover:text-forest-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Organization</h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-400 hover:text-forest-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-display">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-400 hover:text-forest-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sage-400 text-sm">
              © {new Date().getFullYear()} Eco Sakshi. All rights reserved.
            </p>
            <p className="text-sage-400 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
              <span className="text-forest-400 font-medium">Omkar Parelkar</span>
            </p>
            <p className="text-sage-500 text-xs">
              Protecting India's Environment, One Report at a Time
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}