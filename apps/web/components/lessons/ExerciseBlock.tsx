/**
 * ADAGIO - ExerciseBlock Component
 * Composant exercice pratique pour les leçons
 */

'use client';

import { useState } from 'react';
import { Icons } from '@/components';
import type { ExerciseBlock as ExerciseBlockType } from '@adagio/theory';

export interface ExerciseBlockProps {
  exercise: ExerciseBlockType;
  onComplete?: () => void;
}

export function ExerciseBlock({ exercise, onComplete }: ExerciseBlockProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allComplete = completedSteps.size === exercise.steps.length;

  const handleComplete = () => {
    setShowAllCompleted(true);
    onComplete?.();
  };

  const handleReset = () => {
    setCompletedSteps(new Set());
    setShowAllCompleted(false);
  };

  return (
    <div className="my-6 section-frame">
      <div className="p-6">
        <h3 className="text-xl font-metal text-blood uppercase mb-4 flex items-center gap-2">
          <Icons.Sessions size="sm" />
          {exercise.title}
        </h3>

        {showAllCompleted ? (
          <div className="text-center py-8">
            <div className="icon-box border-toxic mx-auto mb-4 w-20 h-20">
              <Icons.Check size="lg" />
            </div>
            <h4 className="text-2xl font-metal text-toxic mb-2">EXERCICE TERMINÉ!</h4>
            <p className="text-gray mb-6">Excellent travail! Continuez à vous entraîner régulièrement.</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 border-2 border-steel bg-blackness text-gray font-bold uppercase hover:border-white transition-all"
            >
              Recommencer l'exercice
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blackness border-2 border-steel p-4">
              <p className="text-white font-bold mb-2">Instructions:</p>
              <p className="text-gray">{exercise.instructions}</p>
            </div>

            {/* Étapes */}
            <div className="space-y-3">
              <p className="text-sm text-gray uppercase tracking-wider mb-4">
                Progression: {completedSteps.size} / {exercise.steps.length}
              </p>

              {exercise.steps.map((step, i) => {
                const isComplete = completedSteps.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleStep(i)}
                    className={`w-full text-left p-4 border-2 transition-all flex items-start gap-4 ${
                      isComplete
                        ? 'border-toxic bg-toxic/10'
                        : 'border-steel bg-blackness hover:border-white'
                    }`}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-sm ${
                      isComplete ? 'bg-toxic text-black' : 'bg-abyss border-2 border-steel text-gray'
                    }`}>
                      {isComplete ? <Icons.Check size="sm" /> : i + 1}
                    </span>
                    <p className={isComplete ? 'text-toxic line-through' : 'text-white'}>
                      {step}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Conseils */}
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="bg-abyss border-l-4 border-rust p-4">
                <p className="text-sm font-bold text-rust uppercase mb-2 flex items-center gap-2">
                  <Icons.Sun size="sm" />
                  Conseils
                </p>
                <ul className="space-y-1">
                  {exercise.tips.map((tip, i) => (
                    <li key={i} className="text-gray text-sm flex items-start gap-2">
                      <span className="text-rust">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bouton terminer */}
            <button
              onClick={handleComplete}
              disabled={!allComplete}
              className={`w-full py-3 font-bold uppercase border-2 transition-all flex items-center justify-center gap-2 ${
                allComplete
                  ? 'border-toxic bg-rust text-white hover:bg-toxic'
                  : 'border-steel bg-blackness text-gray cursor-not-allowed opacity-50'
              }`}
            >
              {allComplete ? (
                <>
                  Marquer comme terminé
                  <Icons.Check size="sm" />
                </>
              ) : (
                'Complétez toutes les étapes'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
