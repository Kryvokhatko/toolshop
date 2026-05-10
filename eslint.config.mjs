import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'playwright-report/**',
            'test-results/**',
            // git-ignored local-only specs
            'tests/UI_tests/login.spec.ts',
            'tests/UI_tests/RegisterUser.spec.ts',
            'tests/UI_tests/apiandui.spec.ts',
            'tests/API_tests/auth.spec.ts',
        ],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs['recommended'].rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
    },
    prettierConfig,
];
