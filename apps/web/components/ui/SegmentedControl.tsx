'use client';

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  ariaLabel?: string;
}

export interface SegmentedControlProps {
  label: string;
  options: readonly SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  wrap?: boolean;
}

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
  wrap = false,
}: SegmentedControlProps) {
  const labelId = useId();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    const nextOption = options[next];
    if (!nextOption) return;
    onChange(nextOption.value);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div className={className}>
      <span id={labelId} className="field-label">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex gap-1.5"
        style={{ flexWrap: wrap ? 'wrap' : 'nowrap' }}
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(element) => {
              buttonsRef.current[index] = element;
            }}
            type="button"
            className="control"
            aria-pressed={option.value === value}
            aria-label={
              option.ariaLabel ?? (typeof option.label === 'string' ? option.label : undefined)
            }
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
