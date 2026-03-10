/**
 * ADAGIO - Lesson Detail Page
 * Page individuelle d'une leçon avec contenu et progression
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MetalNav, MetalFooter, MetalCard, StatCard, MetalButton, Icons } from '@/components';
import Link from 'next/link';

// Donnees des leçons (memes donnees que la page liste)
const LESSONS: Record<string, {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  xp: number;
  description: string;
  topics: string[];
  completed: boolean;
  progress: number;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      example?: string;
    }[];
    conclusion: string;
    exercise?: string;
  };
}> = {
  'modes-grecs-intro': {
    id: 'modes-grecs-intro',
    title: 'Introduction aux Modes Grecs',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: '15 min',
    xp: 50,
    description: 'Decouvrez les 7 modes grecs et leurs emotions caracteristiques.',
    topics: ['Ionien', 'Dorien', 'Phrygien', 'Lydien', 'Mixolydien', 'Eolien', 'Locrien'],
    completed: false,
    progress: 0,
    content: {
      introduction: `Les modes grecs sont des "echelles" derivees de la gamme majeure. Chaque mode a une couleur emotionnelle unique qui peut transformer completement l'ambiance de votre musique.

Dans cette leçon, nous allons explorer les 7 modes et comment les utiliser pour creer des ambiances specifiques dans vos compositions.`,
      sections: [
        {
          title: 'Qu\'est-ce qu\'un Mode?',
          content: `Un mode est simplement une gamme qui commence et finit sur une note differente de la tonique (note "de base") de la gamme majeure.

Par exemple, si vous jouez les notes de DO MAJEUR mais commencez et finissez sur RE, vous jouez le MODE DORIEN.

La formule restant la meme (l'ordre des intervalles), seule la note de depart change - et cela change tout le caractere de la gamme!`,
          example: 'DO MAJEUR: C D E F G A B C\nDORIEN: D E F G A B C D (meme notes, commence sur D)',
        },
        {
          title: 'Les 7 Modes Grecs',
          content: `Voici les 7 modes derives de la gamme majeure, avec leur caracteristiques emotionnelles:

1. IONIEN (le mode "parent" - gamme majeure)
   - Son: heureux, brillant, stable
   - Utilise: Pop, rock, musique enfantine, hymnes

2. DORIEN
   - Son: jazzy, soulful, mineur mais optimiste
   - Utilise: Jazz, funk, rock
   - Exemple célèbre: "So What" - Miles Davis

3. PHRYGIEN
   - Son: exotic, sombre, dramatique
   - Utilise: Flamenco, metal oriental
   - Exemple célèbre: "Andalusian Cadence"

4. LYDIEN
   - Son: reveur, flottant, magique
   - Utilise: Film scores, ambient, rock psychédélique
   - Exemple célèbre: The Simpsons theme

5. MIXOLYDIEN
   - Son: bluesy, rock'n'roll, energie
   - Utilise: Blues, rock, folk
   - Exemple célèbre: "Sweet Home Alabama" - Lynyrd Skynyrd

6. EOLIEN (gamme mineure naturelle)
   - Son: triste, emotionnel, melancolique
   - Utilise: Ballades, metal, classique

7. LOCRIEN
   - Son: tense, instable, menacant
   - Utilise: Metal, horror soundtracks, jazz experimental
   - Exemple célèbre: "Enter Sandman" - Metallica (introduction)`,
        },
        {
          title: 'Comment Memoriser les Modes',
          content: `La methode la plus simple est de memoriser les modes par rapport a la gamme majeure (Ionien):

Ionien: 1 2 3 4 5 6 7 8  (DO RE MI FA SOL LA SI DO)
Dorien: 1 2 b3 4 5 6 b7 8  (commence sur le 2eme degre)
Phrygien: 1 b2 b3 4 5 b6 b7 8  (commence sur le 3eme degre)
Lydien: 1 2 3 #4 5 6 7 8  (commence sur le 4eme degre)
Mixolydien: 1 2 3 4 5 6 b7 8  (commence sur le 5eme degre)
Eolien: 1 2 b3 4 5 b6 b7 8  (commence sur le 6eme degre - gamme mineure!)
Locrien: 1 b2 b3 4 b5 b6 b7 8  (commence sur le 7eme degre)

Astuce: "I Don't Play Like My Aunt Lucy" pour se souvenir de l'ordre!`,
        },
        {
          title: 'Utilisation Pratique',
          content: `Pour utiliser les modes dans votre jeu:

1. Choisissisez un mode en fonction de l'emotion recherchee
   - Triste = Eolien ou Dorien
   - Energique = Mixolydien ou Ionien
   - Exotique = Phrygien
   - Magique = Lydien

2. Trouvez la tonique (la note ou commence votre mode)

3. Jouez la formule du mode en partant de cette tonique

4. Experimentez avec les notes caracteristiques du mode:
   - Dorien: la 6te majeure (la note "optimiste")
   - Phrygien: la 2de mineure (la note "exotique")
   - Lydien: la 4te augmentee (la note "magique")
   - Mixolydien: la 7te mineure (la note "bluesy")`,
        },
      ],
      conclusion: `Les modes sont un outil puissant pour ajouter de la couleur emotionnelle a votre musique. Commencez par explorer un mode a la fois - le Dorien et le Mixolydien sont les plus accessibles pour debuter.

Dans la prochaine lecon, nous approfondirons l'utilisation du mode Phrygien dans le metal!`,
      exercise: `EXERCICE PRATIQUE:

1. Enregistrez un accord de LA MINEUR sur 4 mesures

2. Jouez la gamme de LA DORIEN sur cet accord (LA SI DO RE MI FA# SOL LA)

3. Puis jouez la gamme de LA EOLIEN sur le meme accord (LA SI DO RE MI FA SOL LA)

4. Comparez comment la simple note FA# vs FA change completement l'ambiance!

5. Revenez au DO et essayez tous les modes: commencez chaque fois sur DO et jouez les memes notes (DO RE MI FA SOL LA SI) mais en changeant la tonique de depart. Ecoutez la difference!`,
    },
  },
  'cercle-quintes': {
    id: 'cercle-quintes',
    title: 'Le Cercle des Quintes',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: '20 min',
    xp: 75,
    description: 'Maîtrisez l\'outil le plus puissant pour comprendre les relations harmoniques.',
    topics: ['Cycle des quintes', 'Tonalites voisines', 'Armure', 'Modulation'],
    completed: true,
    progress: 100,
    content: {
      introduction: `Le cercle des quintes (ou cycle des quintes) est l'un des outils les plus puissants en theorie musicale. Il visualise les relations entre les 12 tonalites et permet de comprendre:

- Les armures (combien de alterations par tonalite)
- Les tonalites voisines (facilite les modulations)
- Les accords diatoniques
- Les progressions harmoniques

Apprenons a le lire et l'utiliser!`,
      sections: [
        {
          title: 'Qu\'est-ce que le Cercle des Quintes?',
          content: `Le cercle des quintes est organise en partant de DO et en montant d'une quinte juste (7 demi-tons) a chaque fois:

DO -> SOL -> RE -> LA -> MI -> SI -> FA# -> DO# -> SOL# -> RE# -> LA# -> FA -> DO

A droite du cercle: les tonalites avec dieses (#)
A gauche du cercle: les tonalites avec bemols (b)
En haut: DO (sans alteration)
En bas: FA#/Gb (6 alterations - point maximal)`,
        },
        {
          title: 'Lire les Armures',
          content: `Le cercle des quintes vous dit instantanement combien d'alterations a dans chaque tonalite:

A droite (dieses):
- SOL: 1 dieze (FA#)
- RE: 2 dieses (FA#, DO#)
- LA: 3 dieses (FA#, DO#, SOL#)
- MI: 4 dieses (FA#, DO#, SOL#, RE#)
- SI: 5 dieses (FA#, DO#, SOL#, RE#, LA#)
- FA#: 6 dieses (FA#, DO#, SOL#, RE#, LA#, MI#)
- DO#: 7 dieses (toutes!)

A gauche (bemols):
- FA: 1 bemol (SIb)
- SIb: 2 bemols (SIb, MIb)
- MIb: 3 bemols (SIb, MIb, LAb)
- LAb: 4 bemols (SIb, MIb, LAb, REb)
- REb: 5 bemols (SIb, MIb, LAb, REb, SOLb)
- SOLb: 6 bemols (SIb, MIb, LAb, REb, SOLb, DOb)

Astuce: La derniere alteration ajoutee est la tonique de la tonalite suivante!`,
        },
      ],
      conclusion: `Le cercle des quintes est votre meilleure allie pour comprendre l'harmonie. Entrainez-vous a le visualiser mentalement et utilisez-le pour:
- Trouver rapidement l'armure d'une tonalite
- Identifier les tonalites voisines pour moduler
- Comprendre les relations entre les accords`,
    },
  },
  'intervalles-essentiels': {
    id: 'intervalles-essentiels',
    title: 'Les Intervalles Essentiels',
    category: 'THEORY',
    level: 'BEGINNER',
    duration: '25 min',
    xp: 80,
    description: 'Comprenez et identifiez tous les intervalles. La base de l\'oreille musicale.',
    topics: ['Intervalles simples', 'Intervalles composes', 'Renversement', 'Oreille relative'],
    completed: true,
    progress: 100,
    content: {
      introduction: `Un intervalle est la distance entre deux notes. C'est la base de la melodie, de l'harmonie et de l'oreille musicale.

Comprendre les intervalles vous permettra de:
- Identifier des melodies a l'oreille
- Construire des accords
- Improviser intelligemment
- Comprendre pourquoi certaines notes sonnent bien ensemble`,
      sections: [
        {
          title: 'Les Intervalles Simples (dans l\'octave)',
          content: `Voici les intervalles principaux et leur qualite:

UNISSON (0 demi-tons) - meme note, meme hauteur

SECONDE mineure (1 demi-ton) - dissonant, tension
SECONDE majeure (2 demi-tons) - assez dissonant

TIERCE mineure (3 demi-tons) - TRES IMPORTANT
- Base des accords mineurs
- Son: triste, melancolique

TIERCE majeure (4 demi-tons) - TRES IMPORTANT
- Base des accords majeurs
- Son: heureux, stable

QUARTE juste (5 demi-tons) - stable mais tendu
- Son: resolu, tendu

QUINTE juste (7 demi-tons) - TRES IMPORTANT
- L'intervalle le plus consonant
- Base de l'harmonie occidentale
- Son: puissant, stable

SIXTE mineure (8 demi-tons) - son triste, dramatique
SIXTE majeure (9 demi-tons) - plus lyrique

SEPTIEME mineure (10 demi-tons) - tendu, "bluesy"
SEPTIEME majeure (11 demi-tons) - tres tendu, resolu vers l'octave

OCTAVE (12 demi-tons) - consonance parfaite, meme note differente octave`,
        },
      ],
      conclusion: `Les intervalles sont les briques de la musique. Entrainez votre oreille a les reconnaitre - commencez par la tierce (majeure vs mineure) et la quinte juste, puis ajoutez progressivement les autres.

Dans les prochaines lecons, nous utiliserons ces intervalles pour construire des accords et comprendre les progressions!`,
      exercise: `EXERCICE D'OREILLE:

1. Sur votre guitare/clavier, jouez:
   - DO puis MI (tierce majeure)
   - DO puis MIb (tierce mineure)
   - Comparez la difference "heureux" vs "triste"

2. Jouez:
   - DO puis SOL (quinte juste)
   - Ecoutez la stabilite de cet intervalle

3. Utilisez une app d'entrainement oreille (comme Perfect Ear) pour tester votre reconnaissance d'intervalles quotidiennement!`,
    },
  },
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'text-toxic',
  INTERMEDIATE: 'text-rust',
  ADVANCED: 'text-blood',
};

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const lesson = LESSONS[lessonId];

  const [currentSection, setCurrentSection] = useState(0);
  const [showExercise, setShowExercise] = useState(false);

  // Lesson not found
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />
        <main className="flex-1 px-4 py-24 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-metal text-white mb-4">LEÇON NON TROUVÉE</h1>
            <p className="text-gray mb-8">Cette leçon n'existe pas ou a ete deplacee.</p>
            <Link href="/lessons" className="px-6 py-3 border-2 border-blood bg-toxic text-white font-bold uppercase inline-block">
              Retour aux Leçons
            </Link>
          </div>
        </main>
        <MetalFooter />
      </div>
    );
  }

  const totalSections = lesson.content.sections.length;
  const progress = lesson.completed ? 100 : lesson.progress;

  const handleNext = () => {
    if (showExercise) {
      // Complete lesson
      setShowExercise(false);
      // In real app, save progress to API
      router.push('/lessons');
    } else if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowExercise(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-gray hover:text-white mb-6 transition-colors"
          >
            <Icons.ArrowLeft size="sm" />
            <span className="text-sm uppercase">Retour aux Leçons</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray uppercase tracking-wider">{lesson.category}</span>
                  <span className={`text-xs font-bold uppercase ${LEVEL_COLORS[lesson.level]}`}>
                    {lesson.level}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-metal text-white tracking-tighter">
                  {lesson.title}
                </h1>
              </div>
              {lesson.completed && (
                <div className="icon-box border-toxic">
                  <Icons.Check size="sm" />
                </div>
              )}
            </div>
            <p className="text-gray">{lesson.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-6 mt-4">
              <span className="text-sm text-gray flex items-center gap-2">
                <Icons.Stop size="sm" />
                {lesson.duration}
              </span>
              <span className="text-sm text-rust font-bold">
                +{lesson.xp} XP
              </span>
              {lesson.progress > 0 && !lesson.completed && (
                <span className="text-sm text-toxic">
                  {lesson.progress}% complété
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 border-2 border-steel bg-blackness">
                <div
                  className="h-full bg-toxic border-r border-blood transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topics tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {lesson.topics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs border border-steel bg-blackness text-gray"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Content Card */}
          <MetalCard className="mb-8">
            <div className="p-6">
              {/* Introduction */}
              {currentSection === 0 && !showExercise && (
                <div className="mb-8">
                  <h2 className="text-xl font-metal text-white uppercase mb-4">INTRODUCTION</h2>
                  <div className="prose prose-invert max-w-none">
                    {lesson.content.introduction.split('\n\n').map((para, i) => (
                      <p key={i} className="text-gray mb-4">{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Section */}
              {!showExercise && lesson.content.sections[currentSection] && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-metal text-white uppercase">
                      {lesson.content.sections[currentSection].title}
                    </h2>
                    <span className="text-xs text-gray">
                      {currentSection + 1} / {totalSections}
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none mb-6">
                    {lesson.content.sections[currentSection].content.split('\n\n').map((para, i) => (
                      <p key={i} className="text-gray mb-4">{para}</p>
                    ))}
                  </div>

                  {lesson.content.sections[currentSection].example && (
                    <div className="bg-blackness border-2 border-steel p-4 mt-4">
                      <span className="text-xs text-gray uppercase tracking-wider">EXEMPLE:</span>
                      <pre className="text-toxic font-mono mt-2 whitespace-pre-wrap">
                        {lesson.content.sections[currentSection].example}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Exercise */}
              {showExercise && lesson.content.exercise && (
                <div>
                  <h2 className="text-xl font-metal text-blood uppercase mb-4">
                    <Icons.Sessions size="sm" className="mr-2" />
                    EXERCICE PRATIQUE
                  </h2>
                  <div className="bg-blackness border-2 border-blood p-6">
                    <pre className="text-gray whitespace-pre-wrap font-mono text-sm">
                      {lesson.content.exercise}
                    </pre>
                  </div>
                </div>
              )}

              {!showExercise && lesson.content.conclusion && currentSection === totalSections - 1 && (
                <div className="mt-8 pt-6 border-t-2 border-steel">
                  <h2 className="text-lg font-metal text-white uppercase mb-3">CONCLUSION</h2>
                  <p className="text-gray">{lesson.content.conclusion}</p>
                </div>
              )}
            </div>
          </MetalCard>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`px-6 py-3 text-sm font-bold uppercase border-2 transition-all flex items-center gap-2 ${
                currentSection === 0
                  ? 'border-steel bg-blackness text-gray opacity-50 cursor-not-allowed'
                  : 'border-steel bg-abyss text-gray hover:border-white'
              }`}
            >
              <Icons.ArrowLeft size="sm" />
              Precedent
            </button>

            {/* Section indicators */}
            <div className="hidden md:flex items-center gap-1">
              {lesson.content.sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSection(i)}
                  disabled={showExercise}
                  className={`w-3 h-3 rounded-sm transition-all ${
                    i === currentSection && !showExercise
                      ? 'bg-toxic border border-blood'
                    : i < currentSection || showExercise
                      ? 'bg-steel'
                      : 'bg-abyss border border-steel'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white transition-all flex items-center gap-2 poly-right"
            >
              {showExercise ? (
                <>
                  Terminer
                  <Icons.Check size="sm" />
                </>
              ) : currentSection < totalSections - 1 ? (
                <>
                  Suivant
                  <Icons.ArrowRight size="sm" />
                </>
              ) : lesson.content.exercise ? (
                'Voir l\'Exercice'
              ) : (
                <>
                  Terminer
                  <Icons.Check size="sm" />
                </>
              )}
            </button>
          </div>

          {/* Related lessons */}
          <div className="mt-12">
            <h2 className="text-xl font-metal text-white uppercase mb-6">Leçons Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(LESSONS)
                .filter(l => l.id !== lessonId && l.category === lesson.category)
                .slice(0, 2)
                .map(relatedLesson => (
                  <Link
                    key={relatedLesson.id}
                    href={`/lessons/${relatedLesson.id}`}
                    className="border-2 border-steel bg-abyss p-4 hover:border-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="icon-box border-steel">
                        <Icons.Modes size="sm" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">{relatedLesson.title}</h3>
                        <p className="text-xs text-gray">{relatedLesson.duration} • +{relatedLesson.xp} XP</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <MetalFooter />
    </div>
  );
}
