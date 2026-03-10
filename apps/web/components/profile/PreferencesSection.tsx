/**
 * ADAGIO - PreferencesSection Component
 * Gestion des préférences utilisateur avec sauvegarde offline-first
 * Fonctionne même sans backend API (fallback localStorage)
 */

'use client';

import { useState, useEffect } from 'react';
import { usePreferences, useMutatePreferences, DEFAULT_PREFERENCES } from '@/lib/hooks/use-preferences';

interface Preference {
  id: string;
  label: string;
  value: string;
  options: string[];
}

const PREFERENCES_CONFIG: Omit<Preference, 'value'>[] = [
  { id: 'notation', label: 'Notation', options: ['french', 'english'] },
  { id: 'sound', label: 'Sons', options: ['on', 'off'] },
  { id: 'theme', label: 'Thème', options: ['midnight', 'metal', 'brutal'] },
];

export function PreferencesSection() {
  const { preferences, isLoading, isUsingFallback, isOnline } = usePreferences();
  const { updatePreferences, isPending, isOfflineMode } = useMutatePreferences();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Build local preferences from config and current values
  const [localPreferences, setLocalPreferences] = useState<Preference[]>(() =>
    PREFERENCES_CONFIG.map(pref => {
      const prefValue = DEFAULT_PREFERENCES[pref.id as keyof typeof DEFAULT_PREFERENCES];
      return {
        ...pref,
        value: String(prefValue ?? pref.options[0]),
      };
    })
  );

  // Update local state when preferences change
  useEffect(() => {
    setLocalPreferences(prev =>
      prev.map(pref => {
        const prefValue = preferences[pref.id as keyof typeof preferences];
        return {
          ...pref,
          value: String(prefValue ?? pref.options[0]),
        };
      })
    );
  }, [preferences]);

  const handlePreferenceChange = async (prefId: string, newValue: string) => {
    // Update local UI immediately
    setLocalPreferences(prev =>
      prev.map(pref =>
        pref.id === prefId ? { ...pref, value: newValue } : pref
      )
    );

    // Show saving status
    setSaveStatus('saving');

    try {
      await updatePreferences({ [prefId]: newValue } as Partial<typeof preferences>);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="section-frame p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-metal text-white uppercase">
            Préférences
          </h3>
          {/* Status indicators */}
          {!isOnline && (
            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-blood/20 text-blood border border-blood/30">
              Hors ligne
            </span>
          )}
          {isOnline && isUsingFallback && (
            <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
              Mode local
            </span>
          )}
        </div>
        {saveStatus !== 'idle' && (
          <span className={`text-xs font-bold uppercase ${
            saveStatus === 'saving' ? 'text-gray animate-pulse' :
            saveStatus === 'saved' ? 'text-toxic' :
            'text-blood'
          }`}>
            {saveStatus === 'saving' ? 'Sauvegarde...' :
             saveStatus === 'saved' ? 'Sauvegardé !' :
             'Erreur !'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray text-sm">Chargement...</div>
        </div>
      ) : (
        <div className="space-y-1">
          {localPreferences.map((pref) => (
            <div
              key={pref.id}
              className="flex items-center justify-between py-3 border-b border-steel last:border-0"
            >
              <div>
                <p className="text-sm text-white">{pref.label}</p>
              </div>
              <div className="flex gap-1">
                {pref.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePreferenceChange(pref.id, option)}
                    disabled={isPending}
                    className={`px-3 py-1 text-xs font-bold uppercase border-2 transition-all ${
                      pref.value === option
                        ? 'border-blood bg-toxic text-white shadow-[0_0_10px_rgba(255,0,0,0.3)]'
                        : 'border-steel bg-abyss text-gray hover:border-white hover:bg-white/5'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-pressed={pref.value === option}
                  >
                    {option === 'on' ? 'ON' : option === 'off' ? 'OFF' : option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offline mode notice */}
      {isOfflineMode && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
          <p className="text-xs text-amber-500">
            ⚠️ Mode hors ligne : Les préférences sont sauvegardées localement et seront synchronisées when you reconnect.
          </p>
        </div>
      )}
    </div>
  );
}
