import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';
import { AnalyzeProgressionDto } from './dto/analyze-progression.dto';

// Helper function to safely parse JSON fields
function parseJsonField<T>(value: unknown): T {
  if (value === null || value === undefined) {
    return [] as T;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return [] as T;
    }
  }
  // Already an object/array
  return (value as T) ?? ([] as T);
}

@Injectable()
export class TheoryService {
  private readonly NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  getAllKeys() {
    return this.NOTES.map(note => ({ name: note }));
  }

  async getModes(feeling?: string) {
    const where = feeling
      ? {
          OR: [
            { character: { contains: feeling, mode: 'insensitive' } as const },
            { sensation: { contains: feeling, mode: 'insensitive' } as const },
            { feeling: { contains: feeling, mode: 'insensitive' } as const },
          ],
        }
      : {};

    const modes = await prisma.mode.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return modes.map(mode => ({
      id: mode.id,
      slug: mode.slug,
      name: mode.name,
      intervals: parseJsonField<string[]>(mode.intervals),
      character: mode.character,
      sensation: mode.sensation,
      feeling: mode.feeling,
      greekName: mode.greekName,
      relativeTo: mode.relativeTo,
      axisGroup: mode.axisGroup,
      advice: mode.advice,
    }));
  }

  async getModeBySlug(slug: string) {
    const mode = await prisma.mode.findUnique({
      where: { slug },
    });

    if (!mode) {
      throw new NotFoundException(`Mode ${slug} not found`);
    }

    return {
      id: mode.id,
      slug: mode.slug,
      name: mode.name,
      intervals: parseJsonField<string[]>(mode.intervals),
      character: mode.character,
      sensation: mode.sensation,
      feeling: mode.feeling,
      greekName: mode.greekName,
      relativeTo: mode.relativeTo,
      axisGroup: mode.axisGroup,
      advice: mode.advice,
    };
  }

  async getModesForKey(key: string) {
    const modes = await prisma.mode.findMany({
      orderBy: { name: 'asc' },
    });

    // For each mode, calculate the notes in the key
    return modes.map(mode => ({
      ...mode,
      notes: this.getNotesForKeyAndMode(key, parseJsonField<string[]>(mode.intervals)),
    }));
  }

  async getScales() {
    const scales = await prisma.scale.findMany({
      orderBy: { name: 'asc' },
    });

    return scales.map(scale => ({
      id: scale.id,
      slug: scale.slug,
      name: scale.name,
      root: scale.root,
      intervals: parseJsonField<string[]>(scale.intervals),
      type: scale.type,
      quality: scale.quality,
    }));
  }

  async getChords(root?: string, quality?: string) {
    const where: any = {};

    if (root) where.root = root;
    if (quality) where.quality = quality;

    const chords = await prisma.chord.findMany({
      where,
      orderBy: [{ root: 'asc' }, { quality: 'asc' }],
    });

    return chords.map(chord => ({
      id: chord.id,
      name: chord.name,
      root: chord.root,
      quality: chord.quality,
      intervals: parseJsonField<string[]>(chord.intervals),
      extensions: chord.extensions ? parseJsonField<string[]>(chord.extensions) : undefined,
      fingerings: chord.fingerings,
      tension: chord.tension,
    }));
  }

  async analyzeProgression(dto: AnalyzeProgressionDto) {
    const { key, chords } = dto;

    const analysis = await Promise.all(chords.map(async (chord) => {
      const harmonyRule = await this.getHarmonyRule(chord.degree, 'major');
      const suggestedModes = this.getSuggestedModesForChord(chord);

      return {
        chord: chord,
        scale: suggestedModes[0] || null,
        feeling: harmonyRule?.sensation || '',
        tension: this.getTensionForDegree(chord.degree),
        advice: harmonyRule?.advice || '',
      };
    }));

    const overallFeeling = this.getOverallFeeling(analysis);

    return {
      key,
      analysis,
      overallFeeling,
    };
  }

  getCircleOfFifths(center = 'C') {
    const centerIndex = this.NOTES.indexOf(center);
    const circle = [];

    for (let i = 0; i < 12; i++) {
      const noteIndex = (centerIndex + i * 7) % 12; // Perfect fifth = 7 semitones
      circle.push({
        note: this.NOTES[noteIndex],
        interval: (i * 7) % 12,
      });
    }

    return {
      center,
      circle,
      enharmonics: {
        'C#': 'Db',
        'D#': 'Eb',
        'F#': 'Gb',
        'G#': 'Ab',
        'A#': 'Bb',
      },
    };
  }

  async getAxisTheory() {
    const axisGroups = await prisma.axisGroup.findMany();

    return axisGroups.map(group => ({
      name: group.name,
      notes: parseJsonField<string[]>(group.notes),
      description: group.description,
      substitutions: parseJsonField<string[]>(group.substitutions),
    }));
  }

  private getNotesForKeyAndMode(key: string, intervals: string[]) {
    const keyIndex = this.NOTES.indexOf(key);
    const intervalSemitones: Record<string, number> = {
      '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4, '4': 5, '#4': 6,
      'b5': 6, '5': 7, '#5': 8, 'b6': 8, '6': 9, 'bb7': 9, 'b7': 10, '7': 11
    };

    return intervals.map(interval => {
      const semitones = intervalSemitones[interval] || 0;
      const noteIndex = (keyIndex + semitones) % 12;
      return this.NOTES[noteIndex];
    });
  }

  async getHarmonyRules(tonality?: string) {
    const where = tonality ? { tonality } : {};

    const rules = await prisma.harmonyRule.findMany({
      where,
      orderBy: [{ tonality: 'asc' }, { degree: 'asc' }],
    });

    return rules.map((rule) => ({
      degree: rule.degree,
      tonality: rule.tonality,
      sensation: rule.sensation,
      advice: rule.advice,
    }));
  }

  async getHarmonyRuleByDegree(degree: string, tonality = 'major') {
    const rule = await prisma.harmonyRule.findUnique({
      where: {
        degree_tonality: { degree, tonality },
      },
    });

    if (!rule) {
      throw new NotFoundException(`Harmony rule for ${degree} in ${tonality} not found`);
    }

    return {
      degree: rule.degree,
      tonality: rule.tonality,
      sensation: rule.sensation,
      advice: rule.advice,
    };
  }

  async getTechniques(category?: string, difficulty?: string) {
    const where: any = {};

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const techniques = await prisma.technique.findMany({
      where,
      orderBy: [{ difficulty: 'asc' }, { name: 'asc' }],
    });

    return techniques.map((tech) => ({
      id: tech.id,
      slug: tech.slug,
      name: tech.name,
      category: tech.category,
      difficulty: tech.difficulty,
      description: tech.description,
      diagramUrl: tech.diagramUrl,
      videoUrl: tech.videoUrl,
      audioExample: tech.audioExample,
      notation: tech.notation,
      tips: parseJsonField<string[]>(tech.tips),
      prerequisites: parseJsonField<string[]>(tech.prerequisites),
      relatedTechniques: parseJsonField<string[]>(tech.relatedTechniques),
      estimatedPracticeTime: tech.estimatedPracticeTime,
      milestones: parseJsonField<string[]>(tech.milestones),
    }));
  }

  async getTechniqueBySlug(slug: string) {
    const technique = await prisma.technique.findUnique({
      where: { slug },
    });

    if (!technique) {
      throw new NotFoundException(`Technique ${slug} not found`);
    }

    return {
      id: technique.id,
      slug: technique.slug,
      name: technique.name,
      category: technique.category,
      difficulty: technique.difficulty,
      description: technique.description,
      diagramUrl: technique.diagramUrl,
      videoUrl: technique.videoUrl,
      audioExample: technique.audioExample,
      notation: technique.notation,
      tips: parseJsonField<string[]>(technique.tips),
      prerequisites: parseJsonField<string[]>(technique.prerequisites),
      relatedTechniques: parseJsonField<string[]>(technique.relatedTechniques),
      estimatedPracticeTime: technique.estimatedPracticeTime,
      milestones: parseJsonField<string[]>(technique.milestones),
    };
  }

  async getScaleBySlug(slug: string) {
    const scale = await prisma.scale.findUnique({
      where: { slug },
    });

    if (!scale) {
      throw new NotFoundException(`Scale ${slug} not found`);
    }

    return {
      id: scale.id,
      slug: scale.slug,
      name: scale.name,
      root: scale.root,
      intervals: parseJsonField<string[]>(scale.intervals),
      type: scale.type,
      quality: scale.quality,
    };
  }

  private async getHarmonyRule(degree: string, tonality: string) {
    return prisma.harmonyRule.findUnique({
      where: {
        degree_tonality: { degree, tonality }
      }
    });
  }

  private getSuggestedModesForChord(chord: any) {
    // Simplified logic - in production, use Tonal.js
    const modeMap: Record<string, string[]> = {
      'I': ['Ionien', 'Lydien'],
      'ii': ['Dorien'],
      'iii': ['Phrygien'],
      'IV': ['Lydien', 'Ionien'],
      'V': ['Mixolydien', 'Phrygien Dominant'],
      'vi': ['Éolien'],
      'vii°': ['Locrien'],
    };

    return modeMap[chord.degree] || ['Ionien'];
  }

  private getTensionForDegree(degree: string): 'stable' | 'tense' | 'restless' {
    const tense: Record<string, 'stable' | 'tense' | 'restless'> = {
      'I': 'stable',
      'ii': 'restless',
      'iii': 'restless',
      'IV': 'restless',
      'V': 'tense',
      'vi': 'stable',
      'vii°': 'tense',
    };

    return tense[degree] || 'stable';
  }

  private getOverallFeeling(analysis: any[]) {
    const tenseCount = analysis.filter(a => a.tension === 'tense').length;
    const stableCount = analysis.filter(a => a.tension === 'stable').length;

    if (tenseCount > stableCount) {
      return 'Tense, dramatique';
    } else if (stableCount > tenseCount) {
      return 'Stable, résolu';
    } else {
      return 'Équilibré';
    }
  }
}
