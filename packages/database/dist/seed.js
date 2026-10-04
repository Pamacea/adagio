"use strict";
// ============================================================================
// PRISMA SEED - Adagio Database
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Import seed data
const modes_seed_1 = require("./data/modes.seed");
const scales_seed_1 = require("./data/scales.seed");
const chords_seed_1 = require("./data/chords.seed");
const techniques_seed_1 = require("./data/techniques.seed");
const achievements_seed_1 = require("./data/achievements.seed");
const lessons_seed_1 = require("./data/lessons.seed");
const harmony_seed_1 = require("./data/harmony.seed");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // ============ MODES ============
    console.log('  Seeding modes...');
    for (const mode of modes_seed_1.MODES_SEED) {
        await prisma.mode.upsert({
            where: { slug: mode.slug },
            update: {},
            create: mode,
        });
    }
    // ============ SCALES ============
    console.log('  Seeding scales...');
    for (const scale of scales_seed_1.SCALES_SEED) {
        await prisma.scale.upsert({
            where: { slug: scale.slug },
            update: {},
            create: scale,
        });
    }
    // ============ CHORDS ============
    console.log('  Seeding chords...');
    for (const chord of chords_seed_1.CHORDS_SEED) {
        await prisma.chord.upsert({
            where: { root_quality: { root: chord.root, quality: chord.quality } },
            update: {},
            create: chord,
        });
    }
    // ============ HARMONY RULES ============
    console.log('  Seeding harmony rules...');
    for (const rule of harmony_seed_1.HARMONY_RULES_SEED) {
        await prisma.harmonyRule.upsert({
            where: { degree_tonality: { degree: rule.degree, tonality: rule.tonality } },
            update: {},
            create: rule,
        });
    }
    // ============ AXIS GROUPS ============
    console.log('  Seeding axis groups...');
    const axisGroups = [
        {
            name: 'tonic',
            notes: JSON.stringify(['C', 'Eb', 'Gb', 'A']),
            description: 'Accords de résolution et de repos. Les notes qui permettent de "rentrer à la maison".',
            substitutions: JSON.stringify(['relative-minor', 'relative-major', 'chromatic-mediant']),
        },
        {
            name: 'dominant',
            notes: JSON.stringify(['G', 'B', 'Db', 'E']),
            description: 'Accords de tension qui demandent une résolution. Créent du mouvement et du suspense.',
            substitutions: JSON.stringify(['tritone', 'V7alt', 'diminished']),
        },
        {
            name: 'subdominant',
            notes: JSON.stringify(['F', 'Ab', 'B', 'D']),
            description: 'Accords de départ et de mouvement. Préparent le retour ou le départ.',
            substitutions: JSON.stringify(['ii-V', 'IV-']),
        },
    ];
    for (const group of axisGroups) {
        await prisma.axisGroup.upsert({
            where: { name: group.name },
            update: {},
            create: group,
        });
    }
    // ============ TECHNIQUES ============
    console.log('  Seeding techniques...');
    for (const technique of techniques_seed_1.TECHNIQUES_SEED) {
        await prisma.technique.upsert({
            where: { slug: technique.slug },
            update: {},
            create: technique,
        });
    }
    // ============ ACHIEVEMENTS ============
    console.log('  Seeding achievements...');
    for (const achievement of achievements_seed_1.ACHIEVEMENTS_SEED) {
        await prisma.achievement.upsert({
            where: { slug: achievement.slug },
            update: {},
            create: achievement,
        });
    }
    // ============ LESSONS ============
    console.log('  Seeding lessons...');
    for (const lesson of lessons_seed_1.LESSONS_SEED) {
        await prisma.lesson.upsert({
            where: { slug: lesson.slug },
            update: {},
            create: lesson,
        });
    }
    console.log('✅ Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
