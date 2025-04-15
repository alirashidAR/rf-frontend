'use client';

import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { UserCheck, Clock, ShieldCheck, BarChart3 } from 'lucide-react';

const Header = () => (
  <header className="bg-white shadow-sm py-4 px-8 sticky top-0 z-50">
    <div className="max-w-screen-xl mx-auto flex justify-between items-center">
      <div className="text-blue-700 font-extrabold text-xl">Research<span className="text-gray-800">Finder</span></div>
      <nav className="space-x-6 hidden md:block">
        <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
        <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
        <a href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</a>
        <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
      </nav>
      <Link href="auth/signup">
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition">
            Start Journey →
        </button>
      </Link>

    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-blue-900 text-white py-6 mt-12">
    <div className="max-w-screen-xl mx-auto text-center">
      <p>© 2025 Research Faculty Finder. All rights reserved.</p>
      <div className="mt-4 space-x-4">
        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="hover:text-gray-300">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-br from-blue-50 to-blue-100 py-16 space-y-24">
        {/* Hero Section */}
        <section id="about" className="text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            The Future of Research Mentorship<br /> and Collaboration is Here
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connecting passionate students with experienced faculty to foster impactful research journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="#contact">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Stay In Touch</button>
            </a>
            <a href="#demo">
              <button className="border border-gray-400 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition">Watch A Video</button>
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><UserCheck className="text-blue-600 w-5 h-5" /> Match With Experts</div>
            <div className="flex items-center gap-2"><Clock className="text-blue-600 w-5 h-5" /> Save Time</div>
            <div className="flex items-center gap-2"><BarChart3 className="text-blue-600 w-5 h-5" /> Boost Your Profile</div>
            <div className="flex items-center gap-2"><ShieldCheck className="text-blue-600 w-5 h-5" /> Verified Faculty Only</div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { title: 'Explore Faculty', desc: 'Find faculty based on expertise and research interests.' },
              { title: 'Research Collaboration', desc: 'Connect with faculty for research collaborations.' },
              { title: 'Mentorship', desc: 'Find faculty mentors in your research area.' },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800">Platform at a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-8">
              <div>
                <p className="text-5xl font-bold text-blue-600">120+</p>
                <p className="mt-2 text-gray-700">Universities</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-blue-600">5000+</p>
                <p className="mt-2 text-gray-700">Students Connected</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-blue-600">800+</p>
                <p className="mt-2 text-gray-700">Active Faculty Profiles</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-blue-50 py-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">What Our Users Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { quote: 'The platform helped me find the perfect mentor for my research project!', name: 'Sarah L., Student' },
              { quote: 'It was easy to connect with faculty members working in my research area.', name: 'Dr. John A., Faculty' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md max-w-sm">
                <p className="text-gray-600 italic">"{t.quote}"</p>
                <p className="mt-4 text-gray-700 font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-8 text-left">
              <div>
                <h4 className="text-xl font-semibold text-gray-700">Is the platform free to use?</h4>
                <p className="text-gray-600 mt-2">Yes, Research Faculty Finder is completely free for students and faculty members.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-700">Can I message faculty directly?</h4>
                <p className="text-gray-600 mt-2">Yes, once you're signed in, you can send collaboration requests and start discussions.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-700">How do I get my profile verified?</h4>
                <p className="text-gray-600 mt-2">Faculty verification happens through institutional email confirmation or admin approval.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="bg-blue-50 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
            <h2 className="text-3xl font-semibold text-gray-800">Our Academic Partners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                'IIT Madras', 'IIT Delhi', 'MIT', 'Stanford', 'Harvard', 'IISc',
                'Caltech', 'Oxford', 'Cambridge', 'ETH Zurich', 'UC Berkeley', 'NTU Singapore',
              ].map((name, i) => (
                <div
                  key={i}
                  className="w-32 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-900 shadow-md hover:shadow-xl transition hover:scale-105"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="signup" className="text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-800">Ready to Dive In?</h2>
          <p className="text-xl text-gray-600 mb-6">Start your research journey by joining today.</p>
          <Link href="/auth/signup">
            <Button>Join Now</Button>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
