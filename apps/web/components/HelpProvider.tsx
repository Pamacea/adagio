/**
 * HelpProvider - Contexte et Hook pour le système d'aide
 *
 * Facilite l'intégration des HelpButton, HelpTooltip et HelpModal
 * Centralise l'état d'aide dans l'application
 */

'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { HelpModal, type HelpTopic } from '@adagio/ui';
import { getHelpTopic } from '@/lib/help-content';

// ============================================================================
// CONTEXT
// ============================================================================

interface HelpContextValue {
  isOpen: boolean;
  currentTopic: HelpTopic | null;
  openHelp: (topicId: string) => void;
  closeHelp: () => void;
  setTopic: (topicId: string) => void;
}

const HelpContext = createContext<HelpContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface HelpProviderProps {
  children: ReactNode;
  /** Taille par défaut du modal */
  defaultSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function HelpProvider({ children, defaultSize = 'lg' }: HelpProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<HelpTopic | null>(null);

  const openHelp = useCallback((topicId: string) => {
    const topic = getHelpTopic(topicId);
    if (topic) {
      setCurrentTopic(topic);
      setIsOpen(true);
    }
  }, []);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setTopic = useCallback((topicId: string) => {
    const topic = getHelpTopic(topicId);
    if (topic) {
      setCurrentTopic(topic);
    }
  }, []);

  return (
    <HelpContext.Provider value={{ isOpen, currentTopic, openHelp, closeHelp, setTopic }}>
      {children}
      {currentTopic && (
        <HelpModal
          isOpen={isOpen}
          onClose={closeHelp}
          topic={currentTopic}
          size={defaultSize}
          onTopicChange={setTopic}
        />
      )}
    </HelpContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useHelp() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}

// ============================================================================
// HELP BUTTON COMPONENT
// ============================================================================

import { HelpButton as BaseHelpButton, type HelpButtonProps } from '@adagio/ui';

interface ConnectedHelpButtonProps extends Omit<HelpButtonProps, 'onClick'> {
  topicId: string;
  /** Si true, ouvre le modal au lieu de la tooltip */
  useModal?: boolean;
}

export function HelpButton({ topicId, useModal = false, ...props }: ConnectedHelpButtonProps) {
  const { openHelp } = useHelp();

  const handleClick = () => {
    if (useModal) {
      openHelp(topicId);
    }
  };

  return <BaseHelpButton {...props} onClick={handleClick} />;
}

// ============================================================================
// HELP TOOLTIP COMPONENT
// ============================================================================

import { HelpTooltip as BaseHelpTooltip, type HelpTooltipProps } from '@adagio/ui';

interface ConnectedHelpTooltipProps extends Omit<HelpTooltipProps, 'content'> {
  topicId: string;
}

export function HelpTooltip({ topicId, ...props }: ConnectedHelpTooltipProps) {
  const topic = getHelpTopic(topicId);

  if (!topic) {
    console.warn(`HelpTooltip: Topic "${topicId}" not found`);
    return <>{props.children}</>;
  }

  return <BaseHelpTooltip content={topic.short || topic.title} {...props} />;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ConnectedHelpButtonProps, ConnectedHelpTooltipProps };
