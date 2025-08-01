import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Sign in error:', error);
        alert('Failed to sign in. Please try again.');
      } else {
        // Show success message briefly
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(59, 130, 246, 0.95);
          color: white;
          padding: 20px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          z-index: 10000;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;
        successMessage.textContent = 'Let your mood cravings begin 😊';
        document.body.appendChild(successMessage);
        
        // Remove message after 0.5 seconds
        setTimeout(() => {
          document.body.removeChild(successMessage);
          onSuccess?.();
        }, 500);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 24,
        padding: 48,
        maxWidth: 480,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8
          }}>
            MOODZERA
          </div>
          <div style={{
            fontSize: 16,
            color: '#6b7280',
            fontWeight: 500
          }}>
            Save your favorite recipes
          </div>
        </div>

        {/* Login Form */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            marginBottom: 16
          }}>
            Sign in to continue
          </h2>
          <p style={{
            fontSize: 16,
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: 32
          }}>
            Connect with Google to save and manage your personalized recipe presets
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#ffffff',
            border: '2px solid #e5e7eb',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            fontSize: 16,
            fontWeight: 600,
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            color: '#9ca3af',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.background = '#f3f4f6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#9ca3af';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ✕
        </button>

        {/* Footer */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid #e5e7eb',
          fontSize: 14,
          color: '#9ca3af'
        }}>
          By signing in, you agree to our terms of service and privacy policy
        </div>
      </div>
    </div>
  );
} 