import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Leaf, Target, Eye, Users, Shield, Award, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us - Eco Sakshi',
  description: 'Learn about Eco Sakshi - India\'s citizen-driven environmental compliance network',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-forest-600 to-ocean-700">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
              <Leaf className="w-4 h-4 text-forest-300" />
              <span className="text-sm font-semibold text-white">About Eco Sakshi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-6">
              India's Environmental <span className="text-forest-300">Witness Network</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Empowering citizens to witness, document, and trigger action against 
              environmental violations across India.
            </p>
          </div>
        </section>

        {/* What is Eco Sakshi */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-sage-900 font-display mb-6">
              What is Eco Sakshi?
            </h2>
            <div className="prose prose-lg text-sage-700">
              <p>
                <strong>Eco Sakshi</strong> is a technology-driven environmental reporting and 
                compliance platform that empowers citizens to <strong>witness, document, and trigger action</strong> 
                against environmental violations across India.
              </p>
              <p>
                Built on the belief that <strong>public awareness + verified data = real change</strong>, 
                Eco Sakshi transforms everyday citizens into credible environmental witnesses 
                (<em>"Sakshi"</em>), enabling faster response from authorities, NGOs, and compliance bodies.
              </p>
              <p>
                From polluted rivers and illegal dumping to noise violations and tree felling, 
                Eco Sakshi ensures that <strong>no environmental crime goes unnoticed or undocumented</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-sage-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card bg-gradient-to-br from-forest-600 to-forest-700 text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed">
                  To create a <strong>transparent, accountable, and participatory environmental ecosystem</strong> 
                  where every citizen can actively protect India's natural resources.
                </p>
              </div>
              
              <div className="card bg-gradient-to-br from-ocean-600 to-ocean-700 text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">Our Mission</h3>
                <ul className="text-white/90 space-y-2">
                  <li>• Enable verified citizen reporting of environmental violations</li>
                  <li>• Bridge the gap between citizens, authorities, and NGOs</li>
                  <li>• Use technology and data to accelerate environmental compliance</li>
                  <li>• Build India's most trusted real-time environmental intelligence network</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-sage-900 font-display mb-6">
              Core Philosophy — <span className="text-forest-600">"Be the Sakshi"</span>
            </h2>
            <div className="bg-gradient-to-br from-forest-50 to-ocean-50 rounded-3xl p-8 md:p-12 border border-forest-100">
              <blockquote className="text-2xl md:text-3xl font-display text-sage-800 italic mb-6">
                "Change begins when someone bears witness."
              </blockquote>
              <p className="text-sage-600 text-lg">
                Every environmental improvement starts with someone noticing a violation, 
                someone documenting it, and someone ensuring it reaches the right hands. 
                Eco Sakshi formalizes this process into a <strong>structured, trustworthy digital system</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Creator */}
        <section className="py-20 bg-sage-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-sage-900 font-display mb-8">Created By</h2>
            <div className="card max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest-500 to-ocean-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">OP</span>
              </div>
              <h3 className="text-2xl font-bold text-sage-900 font-display mb-2">Omkar Parelkar</h3>
              <p className="text-sage-600 mb-4">Founder & Developer</p>
              <p className="text-sage-500 text-sm">
                Passionate about using technology to create positive environmental impact in India.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}