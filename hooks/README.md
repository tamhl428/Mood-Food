# useUserLocation Hook

A React hook that requests the user's current geolocation using the browser's Geolocation API with comprehensive error handling.

## Features

- ✅ Requests user's current location with configurable options
- ✅ Handles permission denied errors gracefully
- ✅ Handles timeout errors with retry functionality
- ✅ Provides loading states
- ✅ Includes manual refresh functionality
- ✅ TypeScript support with proper type definitions
- ✅ Automatic cleanup on component unmount

## Usage

### Basic Usage

```tsx
import { useUserLocation } from './hooks/useUserLocation';

function MyComponent() {
  const { latitude, longitude, error, loading } = useUserLocation();

  if (loading) return <div>Getting location...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
    </div>
  );
}
```

### With Custom Options

```tsx
const { latitude, longitude, error, loading, refreshLocation } = useUserLocation({
  enableHighAccuracy: true,
  timeout: 15000,        // 15 seconds
  maximumAge: 600000     // 10 minutes
});
```

### With Manual Refresh

```tsx
const { latitude, longitude, error, loading, refreshLocation } = useUserLocation();

return (
  <div>
    {loading && <div>Loading...</div>}
    {error && (
      <div>
        <p>Error: {error}</p>
        <button onClick={refreshLocation}>Try Again</button>
      </div>
    )}
    {latitude && longitude && (
      <div>
        <p>Location: {latitude}, {longitude}</p>
        <button onClick={refreshLocation}>Refresh</button>
      </div>
    )}
  </div>
);
```

## API

### Parameters

The hook accepts an optional `options` object with the following properties:

- `enableHighAccuracy` (boolean, default: `true`): Request high accuracy location
- `timeout` (number, default: `10000`): Timeout in milliseconds (10 seconds)
- `maximumAge` (number, default: `300000`): Maximum age of cached location in milliseconds (5 minutes)

### Return Value

The hook returns an object with the following properties:

- `latitude` (number | null): The user's latitude
- `longitude` (number | null): The user's longitude
- `error` (string | null): Error message if location request failed
- `loading` (boolean): Whether the location request is in progress
- `refreshLocation` (function): Function to manually refresh the location

## Error Handling

The hook handles the following error scenarios:

1. **Permission Denied**: User denied location access
2. **Position Unavailable**: Location information is unavailable
3. **Timeout**: Location request timed out
4. **Browser Not Supported**: Geolocation API not available

## Browser Compatibility

- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge 12+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Security Notes

- Location requests require user permission
- Only works over HTTPS in production (required by modern browsers)
- Users can deny permission or revoke it later

## Example Component

See `components/LocationExample.tsx` for a complete example of how to use this hook with proper UI states and error handling. 