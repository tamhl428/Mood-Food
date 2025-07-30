import React, { useState } from 'react';
import SurveyModal, { Prefs } from '../components/SurveyModal';
import Chat from '../components/Chat';
import Image from 'next/image';

const defaultPrefs: Prefs = {
  feeling: '',
  cuisine: '',
  budget: '',
  distance: '',
  diet: '',
  adventurousness: '',
  location: '',
  spicy: '',
};

export default function LandingPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [modalOpen, setModalOpen] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSurveySave = (updated: Prefs) => {
    setPrefs(updated);
    // Save to localStorage so the locations page can access it
    if (typeof window !== 'undefined') {
      // Sanitize data before storing
      const sanitizedPrefs = {
        feeling: String(updated.feeling || '').substring(0, 50),
        cuisine: String(updated.cuisine || '').substring(0, 50),
        budget: String(updated.budget || '').substring(0, 20),
        distance: String(updated.distance || '').substring(0, 30),
        diet: String(updated.diet || '').substring(0, 30),
        adventurousness: String(updated.adventurousness || '').substring(0, 50),
        location: String(updated.location || '').substring(0, 100),
        spicy: String(updated.spicy || '').substring(0, 20),
      };
      localStorage.setItem('moodzera_prefs', JSON.stringify(sanitizedPrefs));
    }
    setModalOpen(false);
    setSurveySubmitted(true);
    setShowChat(true);
  };

  const handleGetStarted = () => {
    setModalOpen(true);
  };

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Mood Analysis",
      description: "Our intelligent system understands your emotions and suggests the perfect meal."
    },
    {
      icon: "💬",
      title: "Fun Chat Interface",
      description: "Engage in natural conversation with our food concierge - no searching required."
    },
    {
      icon: "🎯",
      title: "Personalized Recommendations",
      description: "Get suggestions tailored to your mood, preferences, and dietary needs."
    },
    {
      icon: "🚀",
      title: "Instant Ordering",
      description: "From suggestion to order in seconds with seamless restaurant integration."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      icon: "😊",
      title: "Tell us your mood",
      description: "Share how you&apos;re feeling today - happy, stressed, romantic, or anything in between."
    },
    {
      step: "2", 
      icon: "🤖",
      title: "Get AI suggestions",
      description: "Our intelligent system analyzes your mood and suggests the perfect dishes."
    },
    {
      step: "3",
      icon: "🍽️",
      title: "Order and enjoy",
      description: "Browse restaurants, place your order, and enjoy your mood-perfect meal."
    }
  ];

  const testimonials = [
    {
      avatar: "👩‍💼",
      name: "Sarah K.",
      quote: "Got me the perfect comfort food for my breakup 😭❤️",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      avatar: "👨‍💻",
      name: "Mike R.",
      quote: "The AI actually understood my stress and suggested the perfect calming meal!",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      avatar: "👩‍🎨",
      name: "Emma L.",
      quote: "Finally, an app that gets my mood! No more endless scrolling through menus.",
      rating: "⭐⭐⭐⭐⭐"
    }
  ];

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.svg"
                alt="MOODZERA Logo"
                width={200}
                height={80}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MOODZERA Chat</h1>
            <p className="text-gray-600">Let&apos;s find your perfect meal!</p>
          </div>
          
          <SurveyModal
            open={modalOpen}
            prefs={prefs}
            onSave={handleSurveySave}
            onClose={() => setModalOpen(false)}
          />
          
          {!modalOpen && <Chat prefs={prefs} triggerInitialMessage={surveySubmitted} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.svg"
                alt="MOODZERA Logo"
                width={200}
                height={80}
                className="animate-fade-in"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Crave the Right Thing
              <br />
              at the Right Time
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Tell us how you feel. We&apos;ll help you order the food that matches your vibe.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-subtle"
            >
              Get Started →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to your perfect meal</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4 hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose MOODZERA?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of food ordering with AI-powered mood analysis</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from people who found their perfect mood-food match</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-yellow-500">{testimonial.rating}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What&apos;s Your Mood Today?
            </h2>
                      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who&apos;ve discovered the perfect meal for every emotion
            </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Start Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">© 2024 MOODZERA. Made with ❤️ for food lovers everywhere.</p>
        </div>
      </footer>

      <SurveyModal
        open={modalOpen}
        prefs={prefs}
        onSave={handleSurveySave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}