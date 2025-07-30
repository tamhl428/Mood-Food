import React, { useState } from 'react';
import SurveyModal, { Prefs } from '../components/SurveyModal';
import Chat from '../components/Chat';
import Image from 'next/image';

const defaultPrefs: Prefs = {
  feeling: '',
  cuisine: '',
  diet: '',
  adventurousness: '',
  spicy: '',
};

export default function LandingPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [modalOpen, setModalOpen] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSurveySave = (updated: Prefs) => {
    setPrefs(updated);
    // Save to localStorage so the chat can access it
    if (typeof window !== 'undefined') {
      // Sanitize data before storing
      const sanitizedPrefs = {
        feeling: String(updated.feeling || '').substring(0, 50),
        cuisine: String(updated.cuisine || '').substring(0, 50),
        diet: String(updated.diet || '').substring(0, 30),
        adventurousness: String(updated.adventurousness || '').substring(0, 50),
        spicy: String(updated.spicy || '').substring(0, 20),
      };
      localStorage.setItem('moodzera_prefs', JSON.stringify(sanitizedPrefs));
    }
    setModalOpen(false);
    setSurveySubmitted(true);
    setShowChat(true);
  };

  const handleGetStarted = () => {
    console.log('Get Started clicked, setting modalOpen to true');
    setModalOpen(true);
  };

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Mood Analysis",
      description: "Our intelligent system understands your emotions and suggests the perfect recipe."
    },
    {
      icon: "💬",
      title: "Fun Chat Interface",
      description: "Engage in natural conversation with our recipe concierge - no searching required."
    },
    {
      icon: "🎯",
      title: "Personalized Recommendations",
      description: "Get recipe suggestions tailored to your mood, preferences, and dietary needs."
    },
    {
      icon: "🎥",
      title: "YouTube Recipe Videos",
      description: "Watch step-by-step cooking videos for every suggested recipe."
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
      description: "Our intelligent system analyzes your mood and suggests the perfect recipes."
    },
    {
      step: "3",
      icon: "🍽️",
      title: "Watch and cook",
      description: "Get YouTube recipe videos and cook your mood-perfect meal at home."
    }
  ];

  const testimonials = [
    {
      avatar: "👩‍💼",
      name: "Sarah K.",
      quote: "Got me the perfect comfort food recipe for my breakup 😭❤️",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      avatar: "👨‍💻",
      name: "Mike R.",
      quote: "The AI actually understood my stress and suggested the perfect calming recipe!",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      avatar: "👩‍🎨",
      name: "Emma L.",
      quote: "Finally, an app that gets my mood! No more endless scrolling through recipe sites.",
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
            <p className="text-gray-600">Let&apos;s find your perfect recipe!</p>
          </div>
          
          <Chat prefs={prefs} triggerInitialMessage={surveySubmitted} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-bounce-subtle">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MOODZERA
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your mood, your recipe. AI-powered recipe suggestions that match exactly how you&apos;re feeling.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to your perfect mood-based recipe</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of recipe discovery with AI-powered mood analysis</p>
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
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from people who found their perfect mood-recipe match</p>
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
              Join thousands of users who&apos;ve discovered the perfect recipe for every emotion
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
      </div>

      {/* Survey Modal - rendered at root level */}
      {modalOpen && (
        <SurveyModal
          open={modalOpen}
          prefs={prefs}
          onSave={handleSurveySave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}