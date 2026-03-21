/**
 * ADAGIO - LessonRenderer Component
 * Parse et rend les blocs de contenu d'une leçon
 * Supporte markdown, démos, quiz et exercices
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { InteractiveDemo } from './InteractiveDemo';
import { QuizBlock } from './QuizBlock';
import { ExerciseBlock } from './ExerciseBlock';
import type { Lesson, LessonBlock } from '@adagio/theory';
import type { DemoEvent } from './InteractiveDemo';

export interface LessonRendererProps {
  lesson: Lesson;
  onBlockComplete?: (blockIndex: number) => void;
  onDemoEvent?: (event: DemoEvent) => void;
}

/**
 * Composant sécurisé de rendu markdown avec react-markdown
 * - Pas de dangerouslySetInnerHTML
 * - Sanitisation automatique (seul le markdown autorisé est rendu)
 * - Support des tables, listes, et syntaxe étendue (GFM)
 */
function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers avec style metal
          h1: ({ children }) => (
            <h1 className="text-2xl font-metal text-white uppercase mt-6 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-metal text-white uppercase mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-metal text-white uppercase mt-4 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-metal text-white uppercase mt-4 mb-2">{children}</h4>
          ),
          // Paragraphes
          p: ({ children }) => (
            <p className="text-gray mb-4">{children}</p>
          ),
          // Texte en gras
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          // Italique
          em: ({ children }) => (
            <em className="text-gray">{children}</em>
          ),
          // Listes
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 mb-4 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 mb-4 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray">{children}</li>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead>{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border border-steel p-2 text-sm bg-toxic/20 text-toxic font-bold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-steel p-2 text-sm text-gray">{children}</td>
          ),
          // Liens (sécurisés par react-markdown)
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-toxic hover:text-white underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Code inline
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-steel/30 text-toxic px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          // Blocs de code
          pre: ({ children }) => (
            <pre className="bg-steel/20 p-4 rounded-lg overflow-x-auto my-4 border border-steel/30">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Composant TextBlock
 */
function TextBlock({ block }: { block: Extract<LessonBlock, { type: 'text' }> }) {
  return (
    <div className="my-6">
      {block.title && (
        <h2 className="text-xl font-metal text-white uppercase mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-toxic" />
          {block.title}
        </h2>
      )}
      <MarkdownContent content={block.content} />
    </div>
  );
}

export function LessonRenderer({ lesson, onBlockComplete, onDemoEvent }: LessonRendererProps) {
  return (
    <div className="space-y-8">
      {lesson.blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={`text-${index}`} block={block} />;

          case 'demo':
            return (
              <InteractiveDemo
                key={`demo-${index}`}
                block={block}
                onEvent={(event) => {
                  onDemoEvent?.(event);
                  if (event.type === 'quiz_complete' && event.passed) {
                    onBlockComplete?.(index);
                  }
                }}
              />
            );

          case 'quiz':
            return (
              <QuizBlock
                key={`quiz-${index}`}
                questions={block.questions}
                passingScore={block.passingScore}
                onComplete={(result) => {
                  if (result.passed) {
                    onBlockComplete?.(index);
                  }
                  onDemoEvent?.({
                    type: 'quiz_complete',
                    score: result.score,
                    passed: result.passed,
                  });
                }}
              />
            );

          case 'exercise':
            return (
              <ExerciseBlock
                key={`exercise-${index}`}
                exercise={block}
                onComplete={() => onBlockComplete?.(index)}
              />
            );

          default:
            return (
              <div key={`unknown-${index}`} className="p-4 border-2 border-blood text-blood">
                Type de bloc inconnu: {(block as { type: string }).type}
              </div>
            );
        }
      })}
    </div>
  );
}
