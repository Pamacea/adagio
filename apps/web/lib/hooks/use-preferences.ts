// ============================================================================
// PREFERENCES HOOK - Offline-first with localStorage fallback
// Works with or without API backend
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@adagio/api-client';

export interface UserPreferences {
  notation: 'french' | 'english';
  sound: 'on' | 'off';
  theme: 'midnight' | 'metal' | 'brutal';
  showIntervals?: boolean;
  showNotes?: boolean;
  showDegrees?: boolean;
  tuning?: string;
  fretCount?: number;
  volume?: number;
  metronomeVolume?: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notation: 'french',
  sound: 'on',
  theme: 'midnight',
  showIntervals: true,
  showNotes: true,
  showDegrees: false,
  tuning: 'standard',
  fretCount: 24,
  volume: 80,
  metronomeVolume: 70,
};

// Export defaults for use in components
export { DEFAULT_PREFERENCES };

const STORAGE_KEY = 'adagio_preferences';
const SYNC_QUEUE_KEY = 'adagio_preferences_sync_queue';

// ----------------------------------------------------------------------------
// LOCAL STORAGE HELPERS
// ----------------------------------------------------------------------------

function getStoredPreferences(): UserPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : null;
  } catch {
    return null;
  }
}

function saveStoredPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredPreferences() || DEFAULT_PREFERENCES;
    const merged = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save preferences to localStorage:', e);
  }
}

// ----------------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------------

/**
 * Hook pour récupérer les préférences avec fallback localStorage
 * Tente l'API d'abord, fallback sur localStorage si échec
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load preferences on mount
  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      setIsLoading(true);

      // First, try to load from localStorage for instant UI
      const stored = getStoredPreferences();
      if (stored && mounted) {
        setPreferences(stored);
      }

      // Then try API if online
      if (navigator.onLine) {
        try {
          const apiPrefs = await apiClient.get<Partial<UserPreferences>>('/users/me/preferences');
          if (mounted && apiPrefs) {
            const merged = { ...DEFAULT_PREFERENCES, ...apiPrefs };
            setPreferences(merged);
            // Update localStorage with API data
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            setIsUsingFallback(false);
          }
        } catch (error) {
          // API unavailable, use localStorage
          if (mounted) {
            setIsUsingFallback(true);
            if (stored) {
              setPreferences(stored);
            }
          }
        }
      } else {
        setIsUsingFallback(true);
      }

      if (mounted) setIsLoading(false);
    }

    loadPreferences();

    return () => {
      mounted = false;
    };
  }, [isOnline]);

  return { preferences, isLoading, isUsingFallback, isOnline };
}

/**
 * Hook pour mettre à jour les préférences avec sync automatique
 * Sauvegarde immédiatement dans localStorage, puis sync avec l'API
 * Renommé en useMutatePreferences pour éviter le conflit avec use-profile.ts
 */
export function useMutatePreferences() {
  const [isPending, setIsPending] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const updatePreferences = useCallback(async (changes: Partial<UserPreferences>) => {
    setIsPending(true);

    // 1. Immediate localStorage update for UI responsiveness
    saveStoredPreferences(changes);

    // 2. Trigger custom event for other tabs/components
    window.dispatchEvent(new CustomEvent('preferences-changed', { detail: changes }));

    // 3. Try to sync with API if online
    if (navigator.onLine) {
      try {
        await apiClient.patch('/users/me/preferences', changes);
        setIsOfflineMode(false);
      } catch (error) {
        if (error instanceof ApiError) {
          console.warn('API unavailable, preferences saved locally only');
          setIsOfflineMode(true);
        } else {
          throw error;
        }
      }
    } else {
      setIsOfflineMode(true);
    }

    setIsPending(false);
  }, []);

  return { updatePreferences, isPending, isOfflineMode };
}

// Alias pour compatibilité (si utilisé ailleurs)
export { useMutatePreferences as useUpdatePreferencesOffline };

/**
 * Hook pour écouter les changements de préférences (multi-tab sync)
 */
export function usePreferencesListener() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Initial load
    const stored = getStoredPreferences();
    if (stored) {
      setPreferences(stored);
    }

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setPreferences(JSON.parse(e.newValue));
      }
    };

    // Listen for custom events (same tab)
    const handlePreferencesChange = (e: CustomEvent<Partial<UserPreferences>>) => {
      setPreferences(prev => ({ ...prev, ...e.detail }));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('preferences-changed', handlePreferencesChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferences-changed', handlePreferencesChange as EventListener);
    };
  }, []);

  return preferences;
}

/**
 * Hook pour réinitialiser les préférences
 */
export function useResetPreferences() {
  const { updatePreferences } = useMutatePreferences();

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    updatePreferences(DEFAULT_PREFERENCES);
  }, [updatePreferences]);

  return reset;
}
