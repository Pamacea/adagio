/**
 * ADAGIO - QuizBlock Component
 * Composant quiz interactif pour les leçons
 */

'use client';

import { useState, useCallback } from 'react';
import type { QuizQuestion } from '@adagio/theory';
import { Icons } from '@/components';

export interface QuizBlockProps {
  questions: QuizQuestion[];
  passingScore?: number;
  onComplete?: (result: { score: number; passed: boolean; answers: number[] }) => void;
}

export function QuizBlock({ questions, passingScore = 70, onComplete }: QuizBlockProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = useCallback((questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  }, [showResults]);

  const handleSubmit = useCallback(() => {
    // Vérifier que toutes les questions sont répondues
    if (Object.keys(selectedAnswers).length < questions.length) {
      return;
    }

    // Calculer le score
    let correct = 0;
    const answers: number[] = [];

    questions.forEach((q, i) => {
      const answer = selectedAnswers[i];
      answers.push(answer ?? -1);
      if (answer === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    onComplete?.({
      score: finalScore,
      passed: finalScore >= passingScore,
      answers,
    });
  }, [selectedAnswers, questions, passingScore, onComplete]);

  const handleReset = useCallback(() => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  }, []);

  const isComplete = Object.keys(selectedAnswers).length === questions.length;
  const passed = score >= passingScore;

  return (
    <div className="my-6 section-frame">
      <div className="p-6">
        <h3 className="text-xl font-metal text-white uppercase mb-4 flex items-center gap-2">
          <Icons.Fire size="sm" />
          QUIZ - Testez vos connaissances
        </h3>

        {showResults ? (
          <div className="space-y-6">
            {/* Résultat */}
            <div className={`p-6 border-2 ${passed ? 'border-toxic bg-toxic/10' : 'border-blood bg-blood/10'} text-center`}>
              <p className="text-sm text-gray uppercase mb-2">
                {passed ? 'FÉLICITATIONS!' : 'CONTINUEZ VOS EFFORTS'}
              </p>
              <p className={`text-4xl font-metal ${passed ? 'text-toxic' : 'text-blood'}`}>
                {score}%
              </p>
              <p className="text-gray mt-2">
                {passed ? 'Vous avez réussi le quiz!' : `Score requis: ${passingScore}%`}
              </p>
            </div>

            {/* Réponses */}
            <div className="space-y-4">
              {questions.map((q, i) => {
                const userAnswer = selectedAnswers[i];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 border-2 ${isCorrect ? 'border-toxic bg-toxic/5' : 'border-blood bg-blood/5'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-sm font-bold ${
                        isCorrect ? 'bg-toxic text-black' : 'bg-blood text-white'
                      }`}>
                        {isCorrect ? <Icons.Check size="sm" /> : <Icons.Close size="sm" />}
                      </span>
                      <p className="font-bold text-white">{q.question}</p>
                    </div>

                    <div className="ml-9 space-y-2">
                      {q.options.map((option, oi) => (
                        <div
                          key={oi}
                          className={`p-2 text-sm ${
                            oi === q.correctAnswer
                              ? 'text-toxic font-bold'
                              : oi === userAnswer && oi !== q.correctAnswer
                                ? 'text-blood line-through'
                                : 'text-gray'
                          }`}
                        >
                          {oi === q.correctAnswer && <Icons.Check size="sm" className="mr-2 inline" />}
                          {option}
                        </div>
                      ))}

                      {q.explanation && (
                        <p className="mt-2 text-xs text-gray italic">
                          <span className="text-toxic font-mono">EXPLICATION:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 border-2 border-steel bg-blackness text-gray font-bold uppercase hover:border-white transition-all"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progression */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray">
                {Object.keys(selectedAnswers).length} / {questions.length} répondues
              </span>
              <span className="text-toxic font-bold">
                Score requis: {passingScore}%
              </span>
            </div>

            {/* Barre de progression */}
            <div className="h-2 border-2 border-steel bg-blackness">
              <div
                className="h-full bg-toxic border-r border-blood transition-all duration-300"
                style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id} className="border-2 border-steel bg-blackness p-4">
                  <p className="font-bold text-white mb-3">
                    <span className="text-toxic">{i + 1}.</span> {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleSelect(i, oi)}
                        disabled={showResults}
                        className={`w-full text-left p-3 border-2 transition-all ${
                          selectedAnswers[i] === oi
                            ? 'border-toxic bg-toxic/20 text-white'
                            : 'border-steel bg-abyss text-gray hover:border-white'
                        } ${showResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-steel bg-blackness text-xs font-bold mr-3">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton soumettre */}
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`w-full py-3 font-bold uppercase border-2 transition-all flex items-center justify-center gap-2 ${
                isComplete
                  ? 'border-blood bg-toxic text-white hover:bg-blood hover:border-toxic'
                  : 'border-steel bg-blackness text-gray cursor-not-allowed opacity-50'
              }`}
            >
              {isComplete ? (
                <>
                  Vérifier mes réponses
                  <Icons.Check size="sm" />
                </>
              ) : (
                'Répondez à toutes les questions'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
