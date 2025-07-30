import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import vueParser from 'vue-eslint-parser'

export default [
    // Base JavaScript configuration
    {
        files: ['**/*.{js,mjs,cjs}'],
        ...js.configs.recommended,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        plugins: {
            'unused-imports': pluginUnusedImports,
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    // Vue.js configuration
    {
        files: ['**/*.vue'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        plugins: {
            vue: pluginVue,
            'unused-imports': pluginUnusedImports,
        },
        rules: {
            // Vue essential rules
            'vue/no-dupe-keys': 'error',
            'vue/no-duplicate-attributes': 'error',
            'vue/no-parsing-error': 'error',
            'vue/no-reserved-keys': 'error',
            'vue/no-shared-component-data': 'error',
            'vue/no-side-effects-in-computed-properties': 'error',
            'vue/no-template-key': 'error',
            'vue/no-textarea-mustache': 'error',
            'vue/no-unused-components': 'error',
            'vue/no-unused-vars': 'error',
            'vue/no-use-v-if-with-v-for': 'error',
            'vue/require-component-is': 'error',
            'vue/require-render-return': 'error',
            'vue/require-v-for-key': 'error',
            'vue/require-valid-default-prop': 'error',
            'vue/return-in-computed-property': 'error',
            'vue/valid-template-root': 'error',
            'vue/valid-v-bind': 'error',
            'vue/valid-v-cloak': 'error',
            'vue/valid-v-else-if': 'error',
            'vue/valid-v-else': 'error',
            'vue/valid-v-for': 'error',
            'vue/valid-v-html': 'error',
            'vue/valid-v-if': 'error',
            'vue/valid-v-model': 'error',
            'vue/valid-v-on': 'error',
            'vue/valid-v-once': 'error',
            'vue/valid-v-pre': 'error',
            'vue/valid-v-show': 'error',
            'vue/valid-v-text': 'error',

            // Override Vue rules
            'vue/multi-word-component-names': 'off',

            // Unused imports for Vue files
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    // Ignore patterns for Laravel project
    {
        ignores: [
            // Laravel directories
            'vendor/**',
            'storage/**',
            'bootstrap/cache/**',
            'public/build/**',
            'public/hot',

            // Node.js
            'node_modules/**',

            // Build outputs
            'dist/**',
            'build/**',

            // Cache and logs
            '*.log',
            '.env*',

            // IDE
            '.vscode/**',
            '.idea/**',

            // Temporary files
            '*.tmp',
            '*.temp',

            // Laravel specific
            '_ide_helper.php',
            '_ide_helper_models.php',
            '.phpstorm.meta.php',

            // Ignore PHP and Blade files
            '**/*.php',
            '**/*.blade.php',
        ],
    },
]
