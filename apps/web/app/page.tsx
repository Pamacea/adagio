import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo / Title */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-midnight-100 via-midnight-50 to-midnight-100">
            ADAGIO
          </h1>
          <p className="text-xl md:text-2xl text-midnight-300 font-light">
            L&apos;atlas harmonique intelligent pour guitaristes
          </p>
          <p className="text-midnight-400 max-w-2xl mx-auto">
            Ne joue pas des notes, joue des intentions. Explorez la théorie musicale par
            l&apos;émotion et la visualisation interactive.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/harmonic-engine"
            className="btn btn-primary px-8 py-3 text-lg rounded-full hover:scale-105 transition-transform"
          >
            Explorer le Harmonic Engine
          </Link>
          <Link
            href="/composer-assistant"
            className="btn btn-outline px-8 py-3 text-lg rounded-full border-midnight-600 hover:bg-midnight-800"
          >
            Composer Assistant
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-midnight-100 mb-2">
              Harmonic Engine
            </h3>
            <p className="text-midnight-400 text-sm">
              Explorez les modes et gammes par leurs émotions. Visualisez chaque note sur un manche de guitare interactif.
            </p>
          </div>

          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">🎹</div>
            <h3 className="text-xl font-semibold text-midnight-100 mb-2">
              Composer&apos;s Assistant
            </h3>
            <p className="text-midnight-400 text-sm">
              Créez des progressions d&apos;accords avec suggestions intelligentes et analyse des sensations.
            </p>
          </div>

          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-midnight-100 mb-2">
              The Grimoire
            </h3>
            <p className="text-midnight-400 text-sm">
              Une base de connaissances techniques avec un système de progression pour suivre votre apprentissage.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-midnight-500 text-sm">
        <p>Nous ne vendons pas la connaissance, nous la transmettons.</p>
      </footer>
    </div>
  );
}
