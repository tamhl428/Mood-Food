import React, { useEffect, useState } from 'react';
import { trackEvent } from '../lib/posthog-helper';

export default function PostHogTest() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Check if PostHog is initialized
    const checkPostHog = () => {
      const hasKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const hasHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
      
      setTestResults(prev => [
        ...prev,
        `PostHog Key exists: ${hasKey ? '✅' : '❌'}`,
        `PostHog Host exists: ${hasHost ? '✅' : '❌'}`,
        `Environment: ${process.env.NODE_ENV}`,
      ]);

      if (hasKey && hasHost) {
        setIsInitialized(true);
        // Send a test event
        trackEvent('posthog_test_initialized', {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        });
        setTestResults(prev => [...prev, 'Test event sent: posthog_test_initialized']);
      }
    };

    checkPostHog();
  }, []);

  const sendTestEvent = () => {
    trackEvent('manual_test_event', {
      timestamp: new Date().toISOString(),
      test_type: 'manual',
    });
    setTestResults(prev => [...prev, 'Manual test event sent']);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">PostHog Test Panel</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Status: {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={sendTestEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send Test Event
        </button>
      </div>

      <div className="text-sm">
        <h4 className="font-medium mb-2">Test Results:</h4>
        <ul className="space-y-1">
          {testResults.map((result, index) => (
            <li key={index} className="font-mono text-xs">{result}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Debug Info:</strong> Check your browser's developer console for PostHog debug messages.
          If PostHog is working, you should see "PostHog initialized successfully" in the console.
        </p>
      </div>
    </div>
  );
} 