# @adagio/ui

The Adagio Design System - A musical & elegant UI component library for music theory learning.

## Installation

```bash
pnpm add @adagio/ui
```

## Setup

### Tailwind Configuration

Add the preset to your `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [require('@adagio/ui/src/tailwind-preset')],
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
```

## Design Tokens

### Colors

The color palette is inspired by musical notation, instruments, and mood:

- **Primary** - Deep midnight blue (the night of music)
- **Accent** - Golden warmth (like brass instruments)
- **Rose** - Emotional warmth (passionate music)
- **Mode colors** - Greek mode emotional mapping
- **Degree colors** - Scale degree color coding
- **Fretboard** - Wood, frets, strings, and notes

### Typography

Music notation friendly fonts:
- `sans` - Inter (primary UI font)
- `serif` - Merriweather (content)
- `mono` - JetBrains Mono (code/technical)
- `music` - Bravura/Leland/Petaluma (music notation)

### Components

#### Atoms (Smallest building blocks)

- **Button** - Primary, accent, ghost, outline, danger, success variants
- **Input** - Clean inputs with error states and labels
- **Badge** - Mode indicators, degree indicators, status badges
- **ModeIcon** - Greek mode circular indicators with emotional colors

#### Molecules (Combinations of atoms)

- **Card** - Musical & elegant cards with header/footer
- **Modal** - Accessible modal with backdrop and focus management

#### Organisms (Complex UI components)

- **Fretboard** - Interactive guitar fretboard with scale highlighting

## Usage Examples

### Button

```tsx
import { Button } from '@adagio/ui';

<Button variant="primary" size="md">
  Click me
</Button>

<Button variant="accent" size="lg">
  Special action
</.Button>

<Button variant="ghost" isLoading={true}>
  Loading...
</Button>
```

### Input

```tsx
import { Input } from '@adagio/ui';

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  helperText="We'll never share your email"
/>

<Input
  label="Password"
  type="password"
  error={true}
  helperText="Password is required"
/>
```

### Badge (Modes)

```tsx
import { Badge } from '@adagio/ui';

<Badge variant="ionian">Ionian</Badge>
<Badge variant="dorian">Dorian</Badge>
<Badge variant="phrygian">Phrygian</Badge>
```

### Badge (Degrees)

```tsx
import { Badge } from '@adagio/ui';

<Badge variant="degree-I">I</Badge>
<Badge variant="degree-V">V</Badge>
<Badge variant="degree-vi">vi</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@adagio/ui';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>C Major Scale</CardTitle>
    <CardDescription>The foundation of Western harmony</CardDescription>
  </CardHeader>
  <CardContent>
    <p>C - D - E - F - G - A - B - C</p>
  </CardContent>
</Card>
```

### Modal

```tsx
import { Modal, Button } from '@adagio/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Welcome to Adagio"
  size="md"
>
  <p>Start your musical journey today!</p>
  <Button onClick={() => setIsOpen(false)}>Get Started</Button>
</Modal>
```

### Fretboard

```tsx
import { Fretboard } from '@adagio/ui';
import type { FretboardNote } from '@adagio/types';

<Fretboard
  notes={fretboardNotes}
  root="C"
  showFretNumbers={true}
  showStringNumbers={true}
  onClickNote={(note) => console.log(note)}
/>
```

## Utilities

### cn() - className utility

```tsx
import { cn } from '@adagio/ui';

const className = cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
);
```

## License

MIT
