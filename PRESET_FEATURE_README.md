# Moodzera Preset-Saving Feature

This document describes the implementation of the preset-saving feature for Moodzera, allowing users to save, manage, and retrieve their favorite AI-generated recipes.

## Features Implemented

### ✅ Core Features
- **Save Button**: Hoverable "Save as Preset" button on AI recipe cards
- **Google Authentication**: Seamless login via Google OAuth
- **Presets Panel**: Sliding panel with saved recipes (half-screen desktop, full-screen mobile)
- **Edit & Delete**: Inline editing and deletion of saved presets
- **Real-time Sync**: Instant updates using Supabase real-time subscriptions
- **Responsive Design**: Mobile-optimized interface

### ✅ User Experience
- **Login Flow**: Redirects to login if not authenticated, then auto-saves
- **Success Feedback**: Toast notifications for successful saves
- **Smooth Animations**: Slide transitions and hover effects
- **Loading States**: Visual feedback during save operations

## Technical Implementation

### Database Schema (Supabase)

#### Tables Created:
1. **users** - Extends Supabase auth.users
2. **presets** - Stores saved recipes with metadata
3. **sessions** - Additional session management

#### Security:
- Row Level Security (RLS) enabled on all tables
- User-scoped data access
- Automatic user profile creation on signup

### Components Created

#### 1. Authentication
- `hooks/useAuth.ts` - Authentication state management
- `components/LoginModal.tsx` - Google OAuth login modal
- `pages/auth/callback.tsx` - OAuth callback handler

#### 2. Presets Management
- `hooks/usePresets.ts` - CRUD operations for presets
- `components/PresetsPanel.tsx` - Sliding presets panel
- Updated `components/Chat.tsx` - Integrated save functionality

#### 3. Database
- `lib/supabase.ts` - Supabase client configuration
- `supabase-setup.sql` - Database schema and policies

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable Google OAuth in Authentication > Providers
3. Run the SQL script in `supabase-setup.sql` in the SQL Editor
4. Get your project URL and anon key from Settings > API

### 2. Environment Configuration

Create a `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 4. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Usage Flow

### For Users:
1. **Generate Recipe**: Chat with AI to get recipe suggestions
2. **Save Recipe**: Click "Save as Preset" button on recipe card
3. **Login if Needed**: Complete Google OAuth if not logged in
4. **Access Presets**: Click "Presets" button to view saved recipes
5. **Manage Presets**: Edit titles/descriptions or delete presets
6. **Load Presets**: Click on any preset to load it back into chat

### For Developers:
1. **Authentication**: Use `useAuth()` hook for user state
2. **Presets**: Use `usePresets(userId)` hook for CRUD operations
3. **Real-time**: Presets automatically sync across devices
4. **Security**: All data is user-scoped with RLS policies

## Security Features

### ✅ Implemented Security Measures
- **Row Level Security**: Users can only access their own data
- **Input Sanitization**: Data validation and sanitization
- **Authentication Required**: All preset operations require login
- **Secure OAuth**: Google OAuth with proper redirect handling
- **Environment Variables**: Sensitive data stored in environment variables

### Security Checklist:
- [x] RLS policies on all tables
- [x] User-scoped data access
- [x] Input validation and sanitization
- [x] Secure authentication flow
- [x] Environment variable protection
- [x] HTTPS redirects in production

## Performance Optimizations

### ✅ Implemented Optimizations
- **Database Indexes**: Optimized queries with proper indexing
- **Real-time Subscriptions**: Efficient real-time updates
- **Lazy Loading**: Components load only when needed
- **Debounced Operations**: Prevent excessive API calls
- **Caching**: Local state management for better UX

## Mobile Responsiveness

### ✅ Mobile Features
- **Full-screen Panel**: Presets panel expands to full width on mobile
- **Touch-friendly**: Large touch targets and swipe gestures
- **Responsive Layout**: Adapts to different screen sizes
- **Mobile Navigation**: Optimized for mobile interaction patterns

## Future Enhancements

### Planned Features:
- [ ] Recipe categorization and tagging
- [ ] Social sharing of presets
- [ ] Favorite/heart system
- [ ] Recipe recommendations based on saved presets
- [ ] Export/import functionality
- [ ] Recipe ratings and reviews

## Troubleshooting

### Common Issues:

1. **Authentication Not Working**
   - Check Google OAuth configuration
   - Verify redirect URIs in Google Cloud Console
   - Ensure Supabase project settings are correct

2. **Presets Not Saving**
   - Verify Supabase connection
   - Check RLS policies are properly configured
   - Ensure user is authenticated

3. **Real-time Not Working**
   - Verify real-time is enabled in Supabase
   - Check network connectivity
   - Ensure proper subscription setup

### Debug Mode:
Enable debug logging by setting:
```javascript
localStorage.setItem('moodzera_debug', 'true');
```

## API Reference

### useAuth Hook
```typescript
const { user, loading, signInWithGoogle, signOut } = useAuth();
```

### usePresets Hook
```typescript
const { 
  presets, 
  loading, 
  savePreset, 
  updatePreset, 
  deletePreset, 
  loadPreset 
} = usePresets(userId);
```

### Database Types
```typescript
interface Preset {
  id: string;
  user_id: string;
  recipe_title: string;
  one_line_description: string;
  full_recipe_content: string;
  date_saved: string;
  created_at: string;
  updated_at: string;
}
```

## Contributing

When contributing to this feature:

1. **Security First**: Always validate user permissions
2. **Test Authentication**: Verify OAuth flows work correctly
3. **Check Mobile**: Test on various screen sizes
4. **Performance**: Monitor database query performance
5. **User Experience**: Ensure smooth interactions and feedback

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Test with debug mode enabled
4. Check browser console for errors 