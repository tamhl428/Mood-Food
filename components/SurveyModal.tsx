import React, { useState } from 'react';

export interface Prefs {
  feeling: string;
  cuisine: string;
  diet: string;
  adventurousness: string;
  spicy: string;
}

interface SurveyModalProps {
  open: boolean;
  prefs: Prefs;
  onSave: (prefs: Prefs) => void;
  onClose: () => void;
}

const feelingOptions = [
  { value: 'happy', label: 'Happy 😊', description: 'Feeling joyful and upbeat' },
  { value: 'sad', label: 'Sad 😢', description: 'Feeling down or melancholic' },
  { value: 'stressed', label: 'Stressed 😰', description: 'Feeling overwhelmed or anxious' },
  { value: 'excited', label: 'Excited 🎉', description: 'Feeling energetic and enthusiastic' },
  { value: 'romantic', label: 'Romantic 💕', description: 'Feeling loving and intimate' },
  { value: 'nostalgic', label: 'Nostalgic 🕰️', description: 'Feeling sentimental or reminiscent' },
  { value: 'adventurous', label: 'Adventurous 🗺️', description: 'Feeling bold and ready to try new things' },
  { value: 'comfortable', label: 'Comfortable 😌', description: 'Feeling relaxed and at ease' },
  { value: 'energetic', label: 'Energetic ⚡', description: 'Feeling full of life and vigor' },
  { value: 'cozy', label: 'Cozy 🧸', description: 'Feeling warm and snug' },
];

const cuisineOptions = [
  { value: 'Italian', label: 'Italian 🍝' },
  { value: 'Chinese', label: 'Chinese 🥢' },
  { value: 'Indian', label: 'Indian 🍛' },
  { value: 'Mexican', label: 'Mexican 🌮' },
  { value: 'American', label: 'American 🍔' },
  { value: 'Japanese', label: 'Japanese 🍣' },
  { value: 'Thai', label: 'Thai 🍜' },
  { value: 'Mediterranean', label: 'Mediterranean 🥗' },
  { value: 'French', label: 'French 🥐' },
  { value: 'Korean', label: 'Korean 🍲' },
  { value: 'Vietnamese', label: 'Vietnamese 🍜' },
  { value: 'Greek', label: 'Greek 🥙' },
  { value: 'Other', label: 'Other 🌍' },
];

const dietOptions = [
  { value: 'None', label: 'No restrictions' },
  { value: 'Vegetarian', label: 'Vegetarian 🌱' },
  { value: 'Vegan', label: 'Vegan 🥬' },
  { value: 'Gluten-free', label: 'Gluten-free 🌾' },
  { value: 'Dairy-free', label: 'Dairy-free 🥛' },
  { value: 'Keto', label: 'Keto 🥩' },
  { value: 'Paleo', label: 'Paleo 🥑' },
];

const adventurousnessOptions = [
  { value: 'Very conservative', label: 'Very conservative 😊', description: 'Stick to familiar favorites' },
  { value: 'Somewhat conservative', label: 'Somewhat conservative 🙂', description: 'Slight variations on classics' },
  { value: 'Moderate', label: 'Moderate 🤔', description: 'Mix of familiar and new' },
  { value: 'Somewhat adventurous', label: 'Somewhat adventurous 😎', description: 'Try new cuisines and dishes' },
  { value: 'Very adventurous', label: 'Very adventurous 🚀', description: 'Bring on the exotic and unusual' },
];

const spicyOptions = [
  { value: 'Spicy', label: 'Spicy 🔥' },
  { value: 'Mild', label: 'Mild 😊' },
  { value: 'No preference', label: 'No preference 🤷' },
];

export default function SurveyModal({ open, prefs, onSave, onClose }: SurveyModalProps) {
  const [currentPrefs, setCurrentPrefs] = useState<Prefs>(prefs);
  const [step, setStep] = useState(1);

  const handleSave = () => {
    // Sanitize data before saving
    const sanitizedPrefs = {
      feeling: String(currentPrefs.feeling || '').substring(0, 50),
      cuisine: String(currentPrefs.cuisine || '').substring(0, 50),
      diet: String(currentPrefs.diet || '').substring(0, 30),
      adventurousness: String(currentPrefs.adventurousness || '').substring(0, 50),
      spicy: String(currentPrefs.spicy || '').substring(0, 20),
    };
    onSave(sanitizedPrefs);
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updatePrefs = (key: keyof Prefs, value: string) => {
    setCurrentPrefs(prev => ({ ...prev, [key]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">How are you feeling?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-6">
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                    stepNum < step 
                      ? 'bg-blue-500' 
                      : stepNum === step 
                        ? 'bg-blue-400' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Step {step} of 5
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">What&apos;s your mood today?</h3>
              <div className="space-y-4">
                {feelingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('feeling', option.value)}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                      currentPrefs.feeling === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-xl font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-2">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">What cuisine do you prefer?</h3>
              <div className="grid grid-cols-2 gap-4">
                {cuisineOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('cuisine', option.value)}
                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                      currentPrefs.cuisine === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Any dietary restrictions?</h3>
              <div className="space-y-4">
                {dietOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('diet', option.value)}
                    className={`w-full p-6 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                      currentPrefs.diet === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">How adventurous are you with food?</h3>
              <div className="space-y-4">
                {adventurousnessOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('adventurousness', option.value)}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                      currentPrefs.adventurousness === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-2">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">How spicy do you like your food?</h3>
              <div className="space-y-4">
                {spicyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('spicy', option.value)}
                    className={`w-full p-6 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                      currentPrefs.spicy === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <div className="flex justify-between items-center">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                ← Back
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !currentPrefs.feeling) ||
                (step === 2 && !currentPrefs.cuisine) ||
                (step === 3 && !currentPrefs.diet) ||
                (step === 4 && !currentPrefs.adventurousness) ||
                (step === 5 && !currentPrefs.spicy)
              }
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {step === 5 ? 'Get Recipes 🍽️' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 