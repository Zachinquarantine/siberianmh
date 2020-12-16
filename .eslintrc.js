module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['**/generated/*.ts', '**/generated/*.js'],
  rules: {
    // TypeScript
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'interface', prefix: ['I'], format: ['PascalCase'] },
    ],

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-unused-expressions': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],

    // Builtin
    curly: 'error',
    'no-new-wrappers': 'error',
    'no-redeclare': [
      'error',
      {
        builtinGlobals: true,
      },
    ],
    'no-eval': 'error',
    'no-unused-expressions': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'smart'],
    strict: ['error', 'global'],
    'no-buffer-constructor': 'error',
    quotes: ['error', 'single'],
  },
}
