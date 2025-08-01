import React, { useState, useEffect } from 'react';
import { Preset } from '../lib/supabase';

interface PresetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  loading: boolean;
  onLoadPreset: (preset: Preset) => void;
  onUpdatePreset: (presetId: string, updates: { recipe_title?: string; one_line_description?: string }) => Promise<void>;
  onDeletePreset: (presetId: string) => Promise<void>;
}

export default function PresetsPanel({
  isOpen,
  onClose,
  presets,
  loading,
  onLoadPreset,
  onUpdatePreset,
  onDeletePreset
}: PresetsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleEdit = (preset: Preset) => {
    setEditingId(preset.id);
    setEditTitle(preset.recipe_title);
    setEditDescription(preset.one_line_description);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await onUpdatePreset(editingId, {
          recipe_title: editTitle,
          one_line_description: editDescription
        });
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
      } catch (error) {
        console.error('Error updating preset:', error);
        alert('Failed to update preset. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = async (presetId: string) => {
    if (confirm('Are you sure you want to delete this preset? This action cannot be undone.')) {
      try {
        await onDeletePreset(presetId);
      } catch (error) {
        console.error('Error deleting preset:', error);
        alert('Failed to delete preset. Please try again.');
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            backdropFilter: 'blur(2px)'
          }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: isMobile ? '100%' : '50%',
          height: '100vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          transition: 'right 0.3s ease-in-out',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                marginBottom: 4
              }}>
                My Presets
              </h2>
              <p style={{
                fontSize: 14,
                opacity: 0.9,
                margin: 0
              }}>
                {presets.length} saved recipe{presets.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: 8,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 18,
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#6b7280'
            }}>
              Loading presets...
            </div>
          ) : presets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
                color: '#374151'
              }}>
                No presets yet
              </h3>
              <p style={{
                fontSize: 16,
                lineHeight: 1.5
              }}>
                Save your favorite recipes as presets to access them quickly later
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 20,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {editingId === preset.id ? (
                    // Edit mode
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid #3b82f6',
                          borderRadius: 8,
                          fontSize: 16,
                          fontWeight: 600,
                          marginBottom: 8
                        }}
                        placeholder="Recipe title"
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          marginBottom: 16
                        }}
                        placeholder="Description (mood + cuisine)"
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 14,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: 8
                      }}>
                        <h3 style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: '#111827',
                          margin: 0,
                          flex: 1
                        }}>
                          {preset.recipe_title}
                        </h3>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => handleEdit(preset)}
                            style={{
                              padding: '6px 8px',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 14,
                              color: '#6b7280'
                            }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(preset.id)}
                            style={{
                              padding: '6px 8px',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 14,
                              color: '#ef4444'
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: 14,
                        color: '#6b7280',
                        marginBottom: 16,
                        lineHeight: 1.4
                      }}>
                        {preset.one_line_description}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: 12,
                          color: '#9ca3af'
                        }}>
                          Saved {new Date(preset.date_saved).toLocaleDateString()}
                        </span>
                        
                        <button
                          onClick={() => onLoadPreset(preset)}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Load Recipe
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 