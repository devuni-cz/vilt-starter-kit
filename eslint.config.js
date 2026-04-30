import js from '@eslint/js'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import * as pluginImportX from 'eslint-plugin-import-x'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

// Resolver picks up the `@/*` alias from jsconfig.json so import-x can verify paths.
const importXSettings = {
    'import-x/resolver-next': [
        createTypeScriptImportResolver({
            project: './jsconfig.json',
            extensions: ['.js', '.mjs', '.cjs', '.vue'],
        }),
    ],
}

// Catches casing mismatches between import paths and actual filenames
// (Windows/macOS = case-insensitive FS, Linux = case-sensitive — would break in production).
const importXRules = {
    'import-x/no-unresolved': [
        'error',
        {
            caseSensitive: true,
            caseSensitiveStrict: true,
        },
    ],
}

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
            'simple-import-sort': pluginSimpleImportSort,
            'import-x': pluginImportX,
        },
        settings: importXSettings,
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
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            ...importXRules,
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
            'simple-import-sort': pluginSimpleImportSort,
            'import-x': pluginImportX,
        },
        settings: importXSettings,
        rules: {
            ...importXRules,

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

            // Enforce PascalCase for component names in templates
            'vue/component-name-in-template-casing': [
                'error',
                'PascalCase',
                {
                    registeredComponentsOnly: false,
                },
            ],

            // Enforce component tags order: script -> template -> style
            'vue/block-order': [
                'error',
                {
                    order: ['script', 'template', 'style'],
                },
            ],

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

            // Import sorting for Vue files
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // Side effect imports (like polyfills, CSS)
                        ['^\\u0000'],
                        // Vue + framework
                        ['^vue', '^@vue', '^@inertiajs'],
                        // External packages
                        ['^@?\\w'],
                        // Internal aliases (like @/components)
                        ['^@/'],
                        // Relative imports (parent + sibling)
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        // Style imports
                        ['^.+\\.s?css$'],
                    ],
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
