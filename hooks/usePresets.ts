import { useState, useEffect } from 'react';
import { supabase, Preset } from '../lib/supabase';

export function usePresets(userId: string | null) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch presets for the current user
  const fetchPresets = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPresets(data || []);
    } catch (error) {
      console.error('Error fetching presets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save a new preset
  const savePreset = async (presetData: {
    recipe_title: string;
    one_line_description: string;
    full_recipe_content: string;
  }) => {
    if (!userId) throw new Error('User not authenticated');

    // Input validation and sanitization
    const sanitizedData = {
      recipe_title: String(presetData.recipe_title || '').trim().substring(0, 200),
      one_line_description: String(presetData.one_line_description || '').trim().substring(0, 500),
      full_recipe_content: String(presetData.full_recipe_content || '').trim().substring(0, 10000)
    };

    // Validate required fields
    if (!sanitizedData.recipe_title) {
      throw new Error('Recipe title is required');
    }
    if (!sanitizedData.full_recipe_content) {
      throw new Error('Recipe content is required');
    }

    try {
      const { data, error } = await supabase
        .from('presets')
        .insert([
          {
            user_id: userId,
            recipe_title: sanitizedData.recipe_title,
            one_line_description: sanitizedData.one_line_description,
            full_recipe_content: sanitizedData.full_recipe_content,
            date_saved: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setPresets(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving preset:', error);
      throw error;
    }
  };

  // Update a preset
  const updatePreset = async (presetId: string, updates: {
    recipe_title?: string;
    one_line_description?: string;
  }) => {
    // Input validation and sanitization
    const sanitizedUpdates: any = {};
    
    if (updates.recipe_title !== undefined) {
      const sanitizedTitle = String(updates.recipe_title || '').trim().substring(0, 200);
      if (!sanitizedTitle) {
        throw new Error('Recipe title cannot be empty');
      }
      sanitizedUpdates.recipe_title = sanitizedTitle;
    }
    
    if (updates.one_line_description !== undefined) {
      sanitizedUpdates.one_line_description = String(updates.one_line_description || '').trim().substring(0, 500);
    }

    try {
      const { data, error } = await supabase
        .from('presets')
        .update(sanitizedUpdates)
        .eq('id', presetId)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setPresets(prev => prev.map(preset => 
        preset.id === presetId ? data : preset
      ));
      return data;
    } catch (error) {
      console.error('Error updating preset:', error);
      throw error;
    }
  };

  // Delete a preset
  const deletePreset = async (presetId: string) => {
    try {
      const { error } = await supabase
        .from('presets')
        .delete()
        .eq('id', presetId);

      if (error) throw error;
      
      // Update local state
      setPresets(prev => prev.filter(preset => preset.id !== presetId));
    } catch (error) {
      console.error('Error deleting preset:', error);
      throw error;
    }
  };

  // Load a preset into chat
  const loadPreset = (presetId: string) => {
    return presets.find(preset => preset.id === presetId);
  };

  useEffect(() => {
    fetchPresets();
  }, [userId]);

  return {
    presets,
    loading,
    savePreset,
    updatePreset,
    deletePreset,
    loadPreset,
    refetch: fetchPresets
  };
} 