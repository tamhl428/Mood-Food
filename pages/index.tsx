'use client';

import React, { useState } from 'react';
import SurveyModal, { Prefs } from '../components/SurveyModal';
import Chat from '../components/Chat';

const cuisineOptions = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Other'];
const budgetOptions = ['<$10', '$10-20', '$20-30', '$30+'];
const distanceOptions = ['Under 2 km', '2-5 km', '5-10 km', "Doesn't matter"];
const dietOptions = ['None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Other'];
const adventurousnessOptions = ['Safe/Comfort only', 'Open to trying new things', 'Surprise me!'];

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

export default function MainPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [modalOpen, setModalOpen] = useState(true);

  const handleInlineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Mood Food Chat</h1>
      <SurveyModal
        open={modalOpen}
        prefs={prefs}
        onSave={updated => {
          setPrefs(updated);
          setModalOpen(false);
        }}
        onClose={() => setModalOpen(false)}
      />
      {/* Inline filters shown only after modal is closed */}
      {!modalOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <input
            name="feeling"
            type="text"
            placeholder="How are you feeling?"
            value={prefs.feeling}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          />
          <select
            name="cuisine"
            value={prefs.cuisine}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Cuisine</option>
            {cuisineOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <input
            name="location"
            type="text"
            placeholder="Location"
            value={prefs.location}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          />
          <select
            name="budget"
            value={prefs.budget}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Budget</option>
            {budgetOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            name="distance"
            value={prefs.distance}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Distance</option>
            {distanceOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            name="diet"
            value={prefs.diet}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Diet</option>
            {dietOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            name="adventurousness"
            value={prefs.adventurousness}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Adventurousness</option>
            {adventurousnessOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            name="spicy"
            value={prefs.spicy}
            onChange={handleInlineChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="">Spicy Preference</option>
            <option value="Spicy">Spicy</option>
            <option value="Mild">Mild</option>
            <option value="No preference">No preference</option>
          </select>
        </div>
      )}
      {!modalOpen && <Chat prefs={prefs} />}
    </div>
  );
}