import React from 'react';
import { useUserLocation } from '../hooks/useUserLocation';

const LocationExample: React.FC = () => {
  const { latitude, longitude, error, loading, refreshLocation } = useUserLocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  });

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800">Getting your location...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="text-red-800 mb-2">
          <strong>Location Error:</strong> {error}
        </div>
        <button
          onClick={refreshLocation}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="text-green-800 font-semibold mb-2">Your Location</h3>
      <div className="text-green-700 space-y-1">
        <p><strong>Latitude:</strong> {latitude?.toFixed(6)}</p>
        <p><strong>Longitude:</strong> {longitude?.toFixed(6)}</p>
      </div>
      <button
        onClick={refreshLocation}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        Refresh Location
      </button>
    </div>
  );
};

export default LocationExample; 