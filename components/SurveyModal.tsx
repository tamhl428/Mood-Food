import React, { useState } from 'react';

export interface Prefs {
  feeling: string;
  cuisine: string;
  distance: string;
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

const distanceOptions = [
  { value: '0-1', label: '0-1 mile' },
  { value: '1-3', label: '1-3 miles' },
  { value: '3-5', label: '3-5 miles' },
  { value: '5-10', label: '5-10 miles' },
  { value: '10+', label: '10+ miles' },
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
      distance: String(currentPrefs.distance || '').substring(0, 30),
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">How are you feeling?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-2">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 flex-1 rounded-full ${
                    stepNum <= step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What&apos;s your mood today?</h3>
              <div className="space-y-3">
                {feelingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('feeling', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      currentPrefs.feeling === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What cuisine do you prefer?</h3>
              <div className="grid grid-cols-2 gap-3">
                {cuisineOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('cuisine', option.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                      currentPrefs.cuisine === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How far are you willing to travel?</h3>
              <div className="space-y-3">
                {distanceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('distance', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      currentPrefs.distance === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Any dietary restrictions?</h3>
              <div className="space-y-3">
                {dietOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('diet', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      currentPrefs.diet === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How adventurous are you with food?</h3>
              <div className="space-y-3">
                {adventurousnessOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('adventurousness', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      currentPrefs.adventurousness === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How spicy do you like your food?</h3>
              <div className="space-y-3">
                {spicyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePrefs('spicy', option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      currentPrefs.spicy === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
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
        <div className="p-6 border-t border-gray-200 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !currentPrefs.feeling) ||
              (step === 2 && !currentPrefs.cuisine) ||
              (step === 3 && !currentPrefs.distance) ||
              (step === 4 && !currentPrefs.diet) ||
              (step === 5 && !currentPrefs.adventurousness) ||
              (step === 6 && !currentPrefs.spicy)
            }
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === 6 ? 'Get Recipes' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
} 