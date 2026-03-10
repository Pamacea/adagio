/**
 * Adagio - Theory Hub Page
 */

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  Circle,
  Music,
  Guitar,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const theoryCategories = [
  {
    title: 'Circle of Fifths',
    description: 'Understand key relationships and chord progressions',
    href: ROUTES.CIRCLE_OF_FIFTHS,
    icon: Circle,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Modes',
    description: 'Explore the 7 Greek modes and their emotional qualities',
    href: ROUTES.MODES,
    icon: Music,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Chord Progressions',
    description: 'Analyze and understand common progressions',
    href: ROUTES.PROGRESSIONS,
    icon: Guitar,
    color: 'bg-green-500/10 text-green-500',
  },
];

export default function TheoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Music Theory</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Theory Hub</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore the fundamental concepts of music theory through interactive visualizations
          and explanations.
        </p>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {theoryCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.href}
              className="card p-6 hover:border-primary/50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <div className="flex items-center text-primary font-medium">
                Explore
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick concepts */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Concepts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`${ROUTES.MODES}?feeling=happy`}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium mb-1">Happy & Bright</p>
            <p className="text-sm text-muted-foreground">Major, Lydian, Mixolydian</p>
          </Link>
          <Link
            href={`${ROUTES.MODES}?feeling=sad`}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium mb-1">Sad & Emotional</p>
            <p className="text-sm text-muted-foreground">Aeolian, Dorian, Phrygian</p>
          </Link>
          <Link
            href={`${ROUTES.MODES}?feeling=mysterious`}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium mb-1">Mysterious</p>
            <p className="text-sm text-muted-foreground">Lydian, Locrian</p>
          </Link>
          <Link
            href={`${ROUTES.MODES}?feeling=jazzy`}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="font-medium mb-1">Jazzy</p>
            <p className="text-sm text-muted-foreground">Dorian, Mixolydian</p>
          </Link>
        </div>
      </div>

      {/* Learning path */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Suggested Learning Path</h2>
        </div>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <p className="font-medium">Start with the Circle of Fifths</p>
              <p className="text-sm text-muted-foreground">
                Understand how keys relate to each other
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
              2
            </span>
            <div>
              <p className="font-medium">Learn the Major Scale Modes</p>
              <p className="text-sm text-muted-foreground">
                Discover the emotional character of each mode
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
              3
            </span>
            <div>
              <p className="font-medium">Explore Chord Progressions</p>
              <p className="text-sm text-muted-foreground">
                Analyze common progressions and substitutions
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
