/**
 * ADAGIO - AccountActions Component
 * Gestion des actions de compte (mot de passe, export, suppression, déconnexion)
 */

'use client';

import { useState } from 'react';
import { useChangePassword, useDeleteAccount, useExportData, useSignOut } from '@/lib';

export function AccountActions() {
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const exportData = useExportData();
  const signOut = useSignOut();

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // TODO: Show success toast
    } catch (error) {
      setPasswordError((error as { message?: string })?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData.mutateAsync();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adagio-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');

    try {
      await deleteAccount.mutateAsync(deletePassword);
      // Account deleted, redirect to home will happen automatically
      window.location.href = '/';
    } catch (error) {
      setDeleteError((error as { message?: string })?.message || 'Erreur lors de la suppression du compte');
    }
  };

  return (
    <>
      <div className="section-frame p-6">
        <h3 className="text-lg font-metal text-white uppercase mb-4">
          Compte
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 text-left text-sm border-2 border-steel bg-blackness text-gray hover:border-white transition-all"
          >
            Changer le mot de passe
          </button>
          <button
            onClick={handleExport}
            disabled={exportData.isPending}
            className="w-full px-4 py-3 text-left text-sm border-2 border-steel bg-blackness text-gray hover:border-white transition-all disabled:opacity-50"
          >
            {exportData.isPending ? 'Export en cours...' : 'Exporter mes données'}
          </button>
          <button
            onClick={() => signOut.mutate()}
            disabled={signOut.isPending}
            className="w-full px-4 py-3 text-left text-sm border-2 border-rust bg-blackness text-rust hover:border-white hover:text-white transition-all disabled:opacity-50"
          >
            {signOut.isPending ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="section-frame p-6 border-2 border-blood">
        <h3 className="text-lg font-metal text-blood uppercase mb-4">
          Zone de Danger
        </h3>
        <p className="text-sm text-gray mb-4">
          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2 text-sm font-bold uppercase border-2 border-blood bg-blackness text-blood hover:bg-blood hover:text-white transition-all"
        >
          SUPPRIMER MON COMPTE
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="section-frame p-6 max-w-md w-full border-2 border-blood">
            <h3 className="text-xl font-metal text-white uppercase mb-4">
              Changer le mot de passe
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none"
                  required
                />
              </div>

              {passwordError && (
                <p className="text-sm text-blood">{passwordError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="flex-1 px-6 py-2 text-sm font-bold uppercase border-2 border-blood bg-toxic text-white poly-left disabled:opacity-50"
                >
                  {changePassword.isPending ? 'Changement...' : 'CONFIRMER'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  className="flex-1 px-6 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray poly-right"
                >
                  ANNULER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="section-frame p-6 max-w-md w-full border-2 border-blood">
            <h3 className="text-xl font-metal text-blood uppercase mb-4">
              Supprimer le compte
            </h3>

            <p className="text-sm text-gray mb-4">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="text-xs text-gray uppercase tracking-wider block mb-2">
                  Entrez votre mot de passe pour confirmer
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-steel bg-blackness text-white focus:border-blood focus:outline-none"
                  required
                />
              </div>

              {deleteError && (
                <p className="text-sm text-blood">{deleteError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={deleteAccount.isPending}
                  className="flex-1 px-6 py-2 text-sm font-bold uppercase border-2 border-blood bg-blood text-white poly-left disabled:opacity-50"
                >
                  {deleteAccount.isPending ? 'Suppression...' : 'SUPPRIMER'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="flex-1 px-6 py-2 text-sm font-bold uppercase border-2 border-steel bg-abyss text-gray poly-right"
                >
                  ANNULER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
