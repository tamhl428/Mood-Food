import React, { useState, useEffect } from 'react';

export type Prefs = {
  feeling: string;
  cuisine: string;
  budget: string;
  distance: string;
  diet: string;
  adventurousness: string;
  location: string;
  spicy: string;
};

type SurveyModalProps = {
  open: boolean;
  prefs: Prefs;
  onSave: (prefs: Prefs) => void;
  onClose: () => void;
};

const emotionOptions = [
  { value: 'Happy', label: '😊 Happy' },
  { value: 'Sad', label: '😢 Sad' },
  { value: 'Excited', label: '🤩 Excited' },
  { value: 'Tired', label: '😴 Tired' },
  { value: 'Stressed', label: '😰 Stressed' },
  { value: 'Hungry', label: '🍽️ Hungry' },
  { value: 'Hangry', label: '😤 Hangry' },
  { value: 'Anxious', label: '😰 Anxious' },
  { value: 'Cozy', label: '🛋️ Cozy' },
  { value: 'Bored', label: '😐 Bored' },
  { value: 'Motivated', label: '💪 Motivated' },
  { value: 'Romantic', label: '💕 Romantic' },
  { value: 'Energetic', label: '⚡ Energetic' },
  { value: 'Relaxed', label: '😌 Relaxed' },
  { value: 'Adventurous', label: '🏔️ Adventurous' },
  { value: 'Nostalgic', label: '📷 Nostalgic' },
  { value: 'Celebratory', label: '🎉 Celebratory' },
  { value: 'Comfort-seeking', label: '🫂 Comfort-seeking' },
];

const cuisineOptions = [
  { value: 'Italian', label: '🍝 Italian' },
  { value: 'Chinese', label: '🥢 Chinese' },
  { value: 'Indian', label: '🍛 Indian' },
  { value: 'Mexican', label: '🌮 Mexican' },
  { value: 'American', label: '🍔 American' },
  { value: 'Japanese', label: '🍣 Japanese' },
  { value: 'Thai', label: '🍜 Thai' },
  { value: 'Mediterranean', label: '🥙 Mediterranean' },
  { value: 'French', label: '🥐 French' },
  { value: 'Korean', label: '🍲 Korean' },
  { value: 'Vietnamese', label: '🍜 Vietnamese' },
  { value: 'Greek', label: '🥙 Greek' },
  { value: 'Other', label: '🌍 Other' },
];

const budgetOptions = [
  { value: '<$10', label: '💰 <$10' },
  { value: '$10-20', label: '💰💰 $10-20' },
  { value: '$20-30', label: '💰💰💰 $20-30' },
  { value: '$30+', label: '💰💰💰💰 $30+' },
];

const distanceOptions = [
  { value: 'Under 2 km', label: '📍 Under 2 km' },
  { value: '2-5 km', label: '📍📍 2-5 km' },
  { value: '5-10 km', label: '📍📍📍 5-10 km' },
  { value: "Doesn't matter", label: '🌍 Doesn\'t matter' },
];

const dietOptions = [
  { value: 'None', label: '🍽️ No restrictions' },
  { value: 'Vegetarian', label: '🥬 Vegetarian' },
  { value: 'Vegan', label: '🌱 Vegan' },
  { value: 'Halal', label: '☪️ Halal' },
  { value: 'Kosher', label: '✡️ Kosher' },
  { value: 'Gluten-free', label: '🌾 Gluten-free' },
  { value: 'Dairy-free', label: '🥛 Dairy-free' },
  { value: 'Other', label: '⚡ Other' },
];

const adventurousnessOptions = [
  { value: 'Safe/Comfort only', label: '🛡️ Safe/Comfort only' },
  { value: 'Open to trying new things', label: '🔍 Open to trying new things' },
  { value: 'Surprise me!', label: '🎲 Surprise me!' },
];

const spicyOptions = [
  { value: 'Spicy', label: '🌶️ Spicy' },
  { value: 'Mild', label: '🥛 Mild' },
  { value: 'No preference', label: '🤷 No preference' },
];

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
};

const dialogStyle: React.CSSProperties = {
  background: '#fff',
  padding: 32,
  borderRadius: 16,
  minWidth: 400,
  maxWidth: 500,
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  border: '2px solid #e3f2fd',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'none',
  border: 'none',
  fontSize: 24,
  cursor: 'pointer',
  color: '#666',
  padding: 4,
  borderRadius: 4,
  transition: 'all 0.2s',
  zIndex: 10000,
};

const stepIndicatorStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 24,
  gap: 8,
};

const stepDotStyle = (active: boolean, completed: boolean): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0',
  transition: 'all 0.3s',
});

const buttonStyle = (primary: boolean = false): React.CSSProperties => ({
  padding: '12px 24px',
  borderRadius: 8,
  border: primary ? 'none' : '2px solid #e0e0e0',
  background: primary ? '#2196f3' : '#fff',
  color: primary ? '#fff' : '#333',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 500,
  transition: 'all 0.2s',
  minWidth: 100,
  zIndex: 10001,
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 8,
  border: '2px solid #e0e0e0',
  fontSize: 16,
  transition: 'border-color 0.2s',
  marginTop: 8,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#fff',
};

const steps = [
  { title: 'How are you feeling?', field: 'feeling' },
  { title: 'What cuisine do you prefer?', field: 'cuisine' },
  { title: 'What\'s your budget?', field: 'budget' },
  { title: 'How far are you willing to go?', field: 'distance' },
  { title: 'Any dietary restrictions?', field: 'diet' },
  { title: 'How adventurous are you?', field: 'adventurousness' },
  { title: 'Spicy preference?', field: 'spicy' },
  { title: 'Where are you located?', field: 'location' },
];

export default function SurveyModal({ open, prefs, onSave, onClose }: SurveyModalProps) {
  const [local, setLocal] = useState<Prefs>(prefs);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setLocal(prefs);
    setCurrentStep(0);
  }, [prefs]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(local);
  };

  const handleClose = () => {
    // Set default values when closing
    const defaultPrefs: Prefs = {
      feeling: 'Hungry',
      cuisine: 'American',
      budget: '$10-20',
      distance: 'Under 2 km',
      diet: 'None',
      adventurousness: 'Safe/Comfort only',
      location: 'Toronto',
      spicy: 'No preference',
    };
    onSave(defaultPrefs);
    onClose();
  };

  const getCurrentField = () => steps[currentStep].field;
  const getCurrentTitle = () => steps[currentStep].title;

  const renderCurrentStep = () => {
    const field = getCurrentField();
    
    switch (field) {
      case 'feeling':
        return (
          <div>
            {emotionOptions.map(opt => (
              <label key={opt.value} style={{ display: 'block', marginBottom: 12 }}>
                <input
                  type="radio"
                  name="feeling"
                  value={opt.value}
                  checked={local.feeling === opt.value}
                  onChange={handleChange}
                  style={{ marginRight: 12 }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      
      case 'cuisine':
        return (
          <select name="cuisine" value={local.cuisine} onChange={handleChange} style={selectStyle} required>
            <option value="">Select cuisine</option>
            {cuisineOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'budget':
        return (
          <select name="budget" value={local.budget} onChange={handleChange} style={selectStyle} required>
            <option value="">Select budget</option>
            {budgetOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'distance':
        return (
          <select name="distance" value={local.distance} onChange={handleChange} style={selectStyle} required>
            <option value="">Select distance</option>
            {distanceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'diet':
        return (
          <select name="diet" value={local.diet} onChange={handleChange} style={selectStyle} required>
            <option value="">Select diet</option>
            {dietOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'adventurousness':
        return (
          <select name="adventurousness" value={local.adventurousness} onChange={handleChange} style={selectStyle} required>
            <option value="">Select adventurousness</option>
            {adventurousnessOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'spicy':
        return (
          <select name="spicy" value={local.spicy} onChange={handleChange} style={selectStyle} required>
            <option value="">Select preference</option>
            {spicyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'location':
        return (
          <input
            name="location"
            type="text"
            value={local.location}
            onChange={handleChange}
            placeholder="e.g., Toronto, NYC, London"
            style={inputStyle}
            required
          />
        );
      
      default:
        return null;
    }
  };

  const isStepValid = () => {
    const field = getCurrentField();
    return local[field as keyof Prefs] && local[field as keyof Prefs] !== '';
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={e => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={handleClose} title="Close and use defaults">
          ❌
        </button>
        
        <h2 style={{ marginTop: 0, marginBottom: 8, textAlign: 'center', color: '#333' }}>
          {getCurrentTitle()}
        </h2>
        
        <div style={stepIndicatorStyle}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={stepDotStyle(
                index === currentStep,
                index < currentStep
              )}
            />
          ))}
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            {renderCurrentStep()}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: 16,
            position: 'relative',
            zIndex: 10002
          }}>
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              style={{
                ...buttonStyle(),
                opacity: currentStep === 0 ? 0.5 : 1,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Back
            </button>
            
            {isLastStep ? (
              <button
                type="submit"
                disabled={!isStepValid()}
                style={{
                  ...buttonStyle(true),
                  opacity: isStepValid() ? 1 : 0.5,
                  cursor: isStepValid() ? 'pointer' : 'not-allowed',
                }}
              >
                Get Recommendations! 🍽️
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                style={{
                  ...buttonStyle(true),
                  opacity: isStepValid() ? 1 : 0.5,
                  cursor: isStepValid() ? 'pointer' : 'not-allowed',
                }}
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 