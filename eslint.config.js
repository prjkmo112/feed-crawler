import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
    },
    rules: {
      'semi': ['error', 'always'],
      'prefer-const': 'error',
      'linebreak-style': 'off',
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      'indent': ['error', 4],
      'require-jsdoc': 'off',
      'max-len': ["warn", { 
        "code": 130, 
        "tabWidth": 4, 
        "ignoreComments": true, 
        "ignoreUrls": true, 
        "ignoreStrings": true, 
        "ignoreRegExpLiterals": true, 
        "ignorePattern": "`[^`]+`(?:\\);)?$"
      }],
      'quotes': 'off',
      'object-curly-spacing': ["warn", "always"],
      'eol-last': ["warn", "never"],
      'guard-for-in': 'off',
      'curly': ['warn', 'multi-or-nest'],
      'camelcase': ['warn', { 
        "ignoreImports": true, 
        "ignoreGlobals": true, 
        "properties": "never" 
      }]
    },
  },
)