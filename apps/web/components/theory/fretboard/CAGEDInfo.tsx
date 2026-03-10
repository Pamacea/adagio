/**
 * ADAGIO - CAGEDInfo Component
 * Informations sur le système CAGED pour les formes de positions
 */

'use client';

const CAGED_FORMS = ['C Form', 'A Form', 'G Form', 'E Form', 'D Form'] as const;

interface CAGEDInfoProps {
  className?: string;
}

export function CAGEDInfo({ className = '' }: CAGEDInfoProps) {
  return (
    <div className={`mt-8 section-frame p-6 ${className}`}>
      <h3 className="text-lg font-metal text-white uppercase tracking-wider mb-4">
        Formes de Positions
      </h3>
      <p className="text-sm text-gray mb-4">
        Pour jouer ce mode sur tout le manche, connectez les 5 formes du système CAGED.
        Chaque forme commence sur une note tonique différente.
      </p>
      <div className="flex gap-2 flex-wrap">
        {CAGED_FORMS.map((form) => (
          <div
            key={form}
            className="px-4 py-2 border-2 border-steel bg-blackness text-sm text-gray font-bold"
          >
            {form}
          </div>
        ))}
      </div>
    </div>
  );
}
