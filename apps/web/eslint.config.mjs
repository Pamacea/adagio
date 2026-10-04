/**
 * ADAGIO Web - ESLint flat config (ESLint 9)
 * Migre l'ancienne config partagée packages/config/eslint-next.js en flat config.
 * Variante : rules étalées manuellement (plugin import absent de ce package).
 */
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'next-env.d.ts',
      'playwright-report/**',
      'test-results/**',
      'postcss.config.*',
      'tailwind.config.*',
      'vitest.config.*',
      'jest.setup.*',
    ],
  },
  js.configs.recommended,
  {
    // .ts/.tsx + .js (proxy.js utilise `import type`, syntaxe TS)
    files: ['**/*.{ts,tsx,js}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        AbortController: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Site 100 % français : apostrophes littérales dans le JSX
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
];
