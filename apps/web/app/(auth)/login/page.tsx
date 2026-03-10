/**
 * ADAGIO - Login Page
 * Page de connexion avec BetterAuth
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MetalNav, MetalCard, Icons, MetalButton } from '@/components';
import { useUser, useSignOut, useSocialSignIn } from '@/lib/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useUser();
  const signOutMutation = useSignOut();
  const socialSignIn = useSocialSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Show message if already logged in
  if (!authLoading && isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-abyss">
        <MetalNav />

        <main className="flex-1 px-4 py-24 mt-16 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="section-frame p-8 border-2 border-toxic">
              <Icons.User size="lg" className="mx-auto mb-4 text-toxic" />
              <h1 className="text-2xl font-metal text-white uppercase mb-2">
                Deja Connecte
              </h1>
              <p className="text-gray mb-4">
                Vous etes connecte en tant que <span className="text-toxic">{user?.email}</span>
              </p>
              <div className="flex flex-col gap-2">
                <MetalButton
                  onClick={() => router.push('/profile')}
                >
                  Mon Profil
                </MetalButton>
                <button
                  onClick={() => signOutMutation.mutate()}
                  disabled={signOutMutation.isPending}
                  className="px-6 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray hover:border-white transition-all disabled:opacity-50"
                >
                  {signOutMutation.isPending ? 'Deconnexion...' : 'Se Deconnecter'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // BetterAuth sign in
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Redirect to home or profile after successful login
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-abyss">
      <MetalNav />

      <main className="flex-1 px-4 py-24 mt-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-metal text-white tracking-tighter mb-2">
              CONNEXION
            </h1>
            <p className="text-gray text-sm uppercase tracking-widest">
              Accedez a votre espace ADAGIO
            </p>
          </div>

          {/* Login Card */}
          <MetalCard className="border-2 border-blood">
            <div className="p-6">
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 border-2 border-blood bg-blood/20 text-white text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-xs text-gray uppercase tracking-wider block mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="text-xs text-gray uppercase tracking-wider block mb-2">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <Link href="/forgot-password" className="text-xs text-rust hover:text-white transition-colors">
                    Mot de passe oublie ?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white poly-left transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-px hover:-translate-y-px"
                >
                  {loading ? 'Connexion...' : 'SE CONNECTER'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-steel" />
                <span className="text-xs text-gray uppercase">ou</span>
                <div className="flex-1 h-px bg-steel" />
              </div>

              {/* Social login */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => socialSignIn.mutate({ provider: 'github' })}
                  disabled={socialSignIn.isPending}
                  className="w-full px-4 py-2 text-sm border-2 border-steel bg-blackness text-gray hover:border-white hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Icons.GitHub size="sm" />
                  {socialSignIn.isPending ? 'Connexion...' : 'Continuer avec GitHub'}
                </button>
                <button
                  type="button"
                  onClick={() => socialSignIn.mutate({ provider: 'discord' })}
                  disabled={socialSignIn.isPending}
                  className="w-full px-4 py-2 text-sm border-2 border-steel bg-blackness text-gray hover:border-white hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Icons.Discord size="sm" />
                  {socialSignIn.isPending ? 'Connexion...' : 'Continuer avec Discord'}
                </button>
              </div>
            </div>
          </MetalCard>

          {/* Register link */}
          <p className="text-center text-gray text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-toxic hover:text-white transition-colors font-bold">
              Creer un compte
            </Link>
          </p>

          {/* Back to home */}
          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-gray hover:text-white transition-colors flex items-center justify-center gap-1">
              <Icons.ArrowLeft size="sm" />
              Retour a l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
