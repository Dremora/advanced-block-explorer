/* eslint-disable */

const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'import',
    '@typescript-eslint',
    'react',
    'prettier',
    'react-hooks',
    'no-type-assertion'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'prettier/react',
    'prettier/@typescript-eslint'
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  settings: {
    'import/internal-regex': '^src/',
    'import/resolver': {
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/**/*.stories.tsx'],
      rules: {
        'react/display-name': 'off'
      }
    }
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true }
    ],
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true }
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { classes: false, functions: false }
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'import/no-cycle': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['tsx'] }],
    'react/no-array-index-key': 'error',
    'react/prefer-stateless-function': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ],
    'react/jsx-boolean-value': 'error'
  }
};
