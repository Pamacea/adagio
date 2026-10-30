/**
 * HelpModal - Modal d'aide détaillée
 *
 * Modal enrichi avec support markdown et navigation entre sujets liés
 */

import { useState, type ReactNode } from 'react';
import { Modal, type ModalSize } from './Modal';
import { Button } from '../atoms/Button';

export interface HelpRelatedTopic {
  id: string;
  title: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  short?: string;
  content: ReactNode;
  related?: HelpRelatedTopic[];
}

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: HelpTopic | null;
  size?: ModalSize;
  /** Callback when clicking on a related topic */
  onTopicChange?: (topicId: string) => void;
}

/** Rend le gras markdown (**mot**) des contenus texte, sans parser complet. */
function renderBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-bold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function HelpModal({ isOpen, onClose, topic, size = 'lg', onTopicChange }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');

  if (!topic) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={topic.title} size={size}>
      {/* Tabs */}
      {topic.related && topic.related.length > 0 && (
        <div className="flex gap-2 mb-4 border-b border-steel">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-bold uppercase transition-all ${
              activeTab === 'content'
                ? 'text-blood border-b-2 border-blood'
                : 'text-gray hover:text-white'
            }`}
          >
            Contenu
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={`px-4 py-2 text-sm font-bold uppercase transition-all ${
              activeTab === 'related'
                ? 'text-blood border-b-2 border-blood'
                : 'text-gray hover:text-white'
            }`}
          >
            Sujets liés ({topic.related.length})
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'content' && (
        <div className="prose prose-invert prose-sm max-w-none">
          {topic.short && <p className="text-blood font-bold mb-4">{topic.short}</p>}
          {typeof topic.content === 'string' ? (
            <p className="text-gray whitespace-pre-line">{renderBold(topic.content)}</p>
          ) : (
            topic.content
          )}
        </div>
      )}

      {/* Related topics */}
      {activeTab === 'related' && topic.related && topic.related.length > 0 && (
        <div className="space-y-2">
          {topic.related.map((related) => (
            <button
              key={related.id}
              onClick={() => {
                onTopicChange?.(related.id);
                setActiveTab('content');
              }}
              className="w-full p-3 border-2 border-steel bg-blackness hover:border-blood hover:border-blood/50 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-blood">→</span>
                <span className="text-white font-bold">{related.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-steel">
        <Button variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
}
