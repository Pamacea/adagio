// ============================================================================
// SEED DATA - Leçons
// ============================================================================
export const LESSONS_SEED = [
    // === THEORY ===
    {
        slug: 'modes-grecs-intro',
        title: 'Introduction aux Modes Grecs',
        category: 'THEORY',
        level: 'BEGINNER',
        duration: 15,
        xp: 50,
        description: 'Découvrez les 7 modes grecs et leurs émotions caractéristiques.',
        topics: JSON.stringify(['Ionien', 'Dorien', 'Phrygien', 'Lydien', 'Mixolydien', 'Éolien', 'Locrien']),
        content: JSON.stringify({
            introduction: 'Les modes grecs sont des "échelles" dérivées de la gamme majeure. Chaque mode a une couleur émotionnelle unique.',
            sections: [
                {
                    title: 'Qu\'est-ce qu\'un Mode?',
                    content: 'Un mode est simplement une gamme qui commence et finit sur une note différente de la tonique.',
                    example: 'DO MAJEUR: C D E F G A B C\nDORIEN: D E F G A B C D (mêmes notes, commence sur D)',
                },
                {
                    title: 'Les 7 Modes Grecs',
                    content: '1. IONIEN (majeur) - Heureux, brillant\n2. DORIEN - Jazzy, soulful\n3. PHRYGIEN - Exotique, espagnol\n4. LYDIEN - Dreamy, magique\n5. MIXOLYDIEN - Bluesy, rock\n6. ÉOLIEN (mineur) - Triste, émotionnel\n7. LOCRIEN - Tense, instable',
                },
            ],
            conclusion: 'Commencez par explorer le Dorien et le Mixolydien - les plus accessibles!',
        }),
    },
    {
        slug: 'cercle-quintes',
        title: 'Le Cercle des Quintes',
        category: 'THEORY',
        level: 'BEGINNER',
        duration: 20,
        xp: 75,
        description: 'Maîtrisez l\'outil le plus puissant pour comprendre les relations harmoniques.',
        topics: JSON.stringify(['Cycle des quintes', 'Tonalités voisines', 'Armure', 'Modulation']),
        content: JSON.stringify({
            introduction: 'Le cercle des quintes visualise les relations entre les 12 tonalités.',
            sections: [
                {
                    title: 'Lire les Armures',
                    content: 'A droite (dieses): SOL=1, RÉ=2, LA=3, etc.\nA gauche (bémols): FA=1, SIb=2, MIb=3, etc.',
                },
            ],
            conclusion: 'Le cercle des quintes est votre meilleure allié pour comprendre l\'harmonie.',
        }),
    },
    // === FRETBOARD ===
    {
        slug: 'manche-position-c',
        title: 'Position C sur le Manche',
        category: 'FRETBOARD',
        level: 'BEGINNER',
        duration: 30,
        xp: 100,
        description: 'Apprenez à trouver toutes les notes depuis la position C.',
        topics: JSON.stringify(['Position C', 'Têtes de colonne', 'Pattern 5-notes', 'Octaves']),
        content: JSON.stringify({
            introduction: 'La position C est fondamentale pour tous les guitaristes.',
            sections: [
                {
                    title: 'Les 5 Formes CAGED',
                    content: 'C forme, A forme, G forme, E forme, D forme - tout le manche!',
                },
            ],
            conclusion: 'Maîtrisez CAGED pour libérer votre jeu sur tout le manche.',
        }),
    },
    {
        slug: 'sweep-picking-intro',
        title: 'Introduction au Sweep Picking',
        category: 'FRETBOARD',
        level: 'ADVANCED',
        duration: 40,
        xp: 200,
        description: 'La technique emblématique du metal - arpèges rapides en un mouvement continu.',
        topics: JSON.stringify(['Technique', 'Synchronisation', 'Arpèges 3 cordes', 'Arpèges 5 cordes']),
        content: JSON.stringify({
            introduction: 'Le sweep permet de jouer des arpèges rapides avec un minimum d\'effort.',
            sections: [
                {
                    title: 'La Technique de Base',
                    content: 'Le médiator "roule" sur les cordes, chaque note sur une corde différente.',
                },
            ],
            conclusion: 'Commencez lentement avec des arpèges simples (3 cordes).',
        }),
    },
    // === CHORDS ===
    {
        slug: 'accords-ouverts',
        title: 'Accords Ouverts - Les Bases',
        category: 'CHORDS',
        level: 'BEGINNER',
        duration: 20,
        xp: 60,
        description: 'Les accords essentiels que tout guitariste doit connaître.',
        topics: JSON.stringify(['Accords majeurs', 'Accords mineurs', 'Progressions simples']),
        content: JSON.stringify({
            introduction: 'Les accords ouverts sont la base du rock et du folk.',
            sections: [
                {
                    title: 'Les 8 Accords Essentiels',
                    content: 'C, D, E, F, G, A - Am, Em, Dm',
                },
            ],
            conclusion: 'Pratiquez ces accords jusqu\'à ce qu\'ils deviennent automatiques.',
        }),
    },
    {
        slug: 'power-chords',
        title: 'Power Chords et Leurs Variations',
        category: 'CHORDS',
        level: 'BEGINNER',
        duration: 25,
        xp: 70,
        description: 'Le power chord est l\'arme du guitariste rock/metal.',
        topics: JSON.stringify(['Power chord basic', 'Power chord inverse', 'Fry roots']),
        content: JSON.stringify({
            introduction: 'Le power chord est accord résonnant sans tierce - neutre et puissant.',
            sections: [
                {
                    title: 'Le Power Chord Basique',
                    content: 'Root + 5te. Joué sur les cordes graves (6 et 5).',
                },
            ],
            conclusion: 'Maîtrisez le power chord avant tout le reste - c\'est l\'essentiel!',
        }),
    },
    {
        slug: 'jazz-chords-intro',
        title: 'Accords Jazz: Shell Chords',
        category: 'CHORDS',
        level: 'INTERMEDIATE',
        duration: 30,
        xp: 100,
        description: 'Les shell chords (3me et 7me) sont la base du comping jazz.',
        topics: JSON.stringify(['Shell chords', 'Root position', 'Inversions', 'Extensions']),
        content: JSON.stringify({
            introduction: 'En jazz, on joue souvent moins de notes pour laisser plus d\'espace.',
            sections: [
                {
                    title: 'Qu\'est-ce qu\'un Shell Chord?',
                    content: '3ème + 7ème = son complet économique et expressif.',
                },
            ],
            conclusion: 'Apprenez les shell chords dans tous les tons - ils sont partout!',
        }),
    },
    // === PROGRESSIONS ===
    {
        slug: 'progression-ii-V-I',
        title: 'La Progression ii-V-I Expliquée',
        category: 'PROGRESSIONS',
        level: 'INTERMEDIATE',
        duration: 30,
        xp: 90,
        description: 'La progression la plus importante du jazz.',
        topics: JSON.stringify(['Fonction diatonique', 'Tension et résolution', 'Variations', 'Turnaround']),
        content: JSON.stringify({
            introduction: 'Le ii-V-I est omniprésent dans le jazz pour une bonne raison.',
            sections: [
                {
                    title: 'Pourquoi ça Fonctionne?',
                    content: 'ii est instable, V est tendu, I est stable. Le mouvement crée une histoire.',
                },
            ],
            conclusion: 'Pratiquez le ii-V-I dans tous les tonalités - c\'est la base du jazz!',
        }),
    },
    // === COMPOSITION ===
    {
        slug: 'composition-structure',
        title: 'Structure d\'une Chanson',
        category: 'COMPOSITION',
        level: 'BEGINNER',
        duration: 25,
        xp: 70,
        description: 'Verse, chorus, bridge... Apprenez les structures standards.',
        topics: JSON.stringify(['Verse-Chorus', 'AABA', 'Rondo', 'Bridge']),
        content: JSON.stringify({
            introduction: 'La plupart des chansons suivent des structures familières.',
            sections: [
                {
                    title: 'Les Structures les Plus Courantes',
                    content: 'Verse-Chorus-V-C: le standard pop/rock\nAABA: standard jazz\nABAB: folk/country',
                },
            ],
            conclusion: 'Utilisez ces structures comme cadre, mais n\'ayez pas peur d\'expérimenter!',
        }),
    },
];
export const LESSON_CATEGORIES = [
    'THEORY',
    'FRETBOARD',
    'CHORDS',
    'NOTATION',
    'PROGRESSIONS',
    'COMPOSITION',
];
export const LESSON_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
