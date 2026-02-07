import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier, { rules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    jseslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    prettier,
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'error',
            'max-len': [
                'error',
                {
                    code: 120,
                    ignoreComments: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreUrls: true
                }
            ],
        } 
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.test.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        }
    }
];