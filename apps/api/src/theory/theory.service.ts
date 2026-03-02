import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@adagio/database';
import { AnalyzeProgressionDto } from './dto/analyze-progression.dto';

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
            { character: { contains: feeling, mode: 'insensitive' } },
            { sensation: { contains: feeling, mode: 'insensitive' } },
            { feeling: { contains: feeling, mode: 'insensitive' } },
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
      intervals: JSON.parse(mode.intervals),
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
      intervals: JSON.parse(mode.intervals),
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
      notes: this.getNotesForKeyAndMode(key, JSON.parse(mode.intervals)),
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
      intervals: JSON.parse(scale.intervals),
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
      intervals: JSON.parse(chord.intervals),
      extensions: chord.extensions ? JSON.parse(chord.extensions) : undefined,
      fingerings: chord.fingerings,
      tension: chord.tension,
    }));
  }

  async analyzeProgression(dto: AnalyzeProgressionDto) {
    const { key, chords } = dto;

    const analysis = chords.map(chord => {
      const harmonyRule = this.getHarmonyRule(chord.degree, 'major');
      const suggestedModes = this.getSuggestedModesForChord(chord);

      return {
        chord: chord,
        scale: suggestedModes[0] || null,
        feeling: harmonyRule?.sensation || '',
        tension: this.getTensionForDegree(chord.degree),
        advice: harmonyRule?.advice || '',
      };
    });

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
      notes: JSON.parse(group.notes),
      description: group.description,
      substitutions: JSON.parse(group.substitutions),
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
