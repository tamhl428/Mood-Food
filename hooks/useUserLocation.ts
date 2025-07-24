import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useUserLocation = (options: GeolocationOptions = {}) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser',
        loading: false
      });
      return;
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000, // 5 minutes
      ...options
    };

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage: string;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable. Please try again.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage = 'An unknown error occurred while getting your location.';
      }

      setLocation({
        latitude: null,
        longitude: null,
        error: errorMessage,
        loading: false
      });
    };

    // Request location
    const watchId = navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      defaultOptions
    );

    // Cleanup function
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  // Function to manually refresh location
  const refreshLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser',
        loading: false
      });
      return;
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
      ...options
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
        setLocation({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false
        });
      },
      defaultOptions
    );
  };

  return {
    ...location,
    refreshLocation
  };
}; 