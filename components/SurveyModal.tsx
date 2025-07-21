import React, { useState, useEffect } from 'react';

export type Prefs = {
  feeling: string;
  cuisine: string;
  budget: string;
  distance: string;
  diet: string;
  adventurousness: string;
  location: string;
  spicy: string; // New field
};

type SurveyModalProps = {
  open: boolean;
  prefs: Prefs;
  onSave: (prefs: Prefs) => void;
  onClose: () => void;
};

const cuisineOptions = [
  { value: '', label: 'Select cuisine' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Indian', label: 'Indian' },
  { value: 'Mexican', label: 'Mexican' },
  { value: 'American', label: 'American' },
  { value: 'Other', label: 'Other' },
];

const budgetOptions = [
  { value: '', label: 'Select budget' },
  { value: '<$10', label: '<$10' },
  { value: '$10-20', label: '$10-20' },
  { value: '$20-30', label: '$20-30' },
  { value: '$30+', label: '$30+' },
];

const distanceOptions = [
  { value: '', label: 'Select distance' },
  { value: 'Under 2 km', label: 'Under 2 km' },
  { value: '2-5 km', label: '2-5 km' },
  { value: '5-10 km', label: '5-10 km' },
  { value: "Doesn't matter", label: "Doesn't matter" },
];

const dietOptions = [
  { value: '', label: 'Select diet' },
  { value: 'None', label: 'None' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Halal', label: 'Halal' },
  { value: 'Kosher', label: 'Kosher' },
  { value: 'Other', label: 'Other' },
];

const adventurousnessOptions = [
  { value: '', label: 'Select adventurousness' },
  { value: 'Safe/Comfort only', label: 'Safe/Comfort only' },
  { value: 'Open to trying new things', label: 'Open to trying new things' },
  { value: 'Surprise me!', label: 'Surprise me!' },
];

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  minWidth: 320,
  boxShadow: '0 2px 16px #0002',
};

export default function SurveyModal({ open, prefs, onSave, onClose }: SurveyModalProps) {
  const [local, setLocal] = useState<Prefs>(prefs);

  useEffect(() => {
    setLocal(prefs);
  }, [prefs]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(local);
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Survey</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            Feeling:
            <input
              name="feeling"
              type="text"
              value={local.feeling}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            />
          </label>
          <label>
            Cuisine:
            <select
              name="cuisine"
              value={local.cuisine}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              {cuisineOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Budget:
            <select
              name="budget"
              value={local.budget}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              {budgetOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Distance:
            <select
              name="distance"
              value={local.distance}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              {distanceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Diet:
            <select
              name="diet"
              value={local.diet}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              {dietOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Adventurousness:
            <select
              name="adventurousness"
              value={local.adventurousness}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              {adventurousnessOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Do you prefer spicy food?
            <select
              name="spicy"
              value={local.spicy || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            >
              <option value="">Select preference</option>
              <option value="Spicy">Spicy</option>
              <option value="Mild">Mild</option>
              <option value="No preference">No preference</option>
            </select>
          </label>
          <label>
            Location:
            <input
              name="location"
              type="text"
              value={local.location}
              onChange={handleChange}
              style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
              required
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: 8, borderRadius: 4 }}>Cancel</button>
            <button type="submit" style={{ padding: 8, borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
} 