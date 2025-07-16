---
mode: agent
---

# Development Workflow & Code Quality Prompt

## Expected Output Format

When working with development workflows, provide:

1. **Git hooks setup** - Husky configuration for pre-commit and pre-push
2. **Code quality gates** - ESLint, Laravel Pint, and TypeScript checks
3. **Automated testing** - Pre-commit test execution
4. **Build optimization** - Vite configuration and asset optimization
5. **CI/CD integration** - GitHub Actions and deployment pipelines
6. **Code formatting** - Prettier and Pint integration with lint-staged

## Development Workflow Patterns

### Enhanced Husky Configuration

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged for staged files
npx lint-staged

# Run PHP static analysis
echo "📊 Running PHP static analysis..."
php vendor/bin/phpstan analyse --memory-limit=32G --no-progress

# Run backend tests for critical areas
echo "🧪 Running critical backend tests..."
php artisan test --parallel --filter="PaymentTest|VehicleTest|OrderTest"

echo "✅ Pre-commit checks completed!"
```

```json
// .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Run full test suite
echo "🧪 Running full test suite..."
php artisan test --parallel

# Build frontend to check for errors
echo "🏗️ Building frontend..."
npm run build

# Check for TypeScript errors
echo "🔍 Checking TypeScript..."
npx vue-tsc --noEmit

echo "✅ Pre-push checks completed!"
```

### Enhanced lint-staged Configuration

```json
// Enhanced lint-staged in package.json
{
    "lint-staged": {
        "*.php": ["php ./vendor/bin/pint --config=/pint.json", "php ./vendor/bin/phpstan analyse --memory-limit=2G --no-progress"],
        "*.{js,ts,vue}": ["prettier --write", "eslint --fix", "vue-tsc --noEmit"],
        "*.{json,md,yaml,yml}": ["prettier --write"],
        "resources/css/*.css": ["prettier --write"]
    }
}
```

### Development Scripts Enhancement

```json
// Enhanced package.json scripts
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "build:ssr": "vite build && vite build --ssr",
        "preview": "vite preview",
        "format": "prettier --write resources/ && php vendor/bin/pint . --config=/pint.json",
        "format:check": "prettier --check resources/ && php vendor/bin/pint . --config=/pint.json --test",
        "lint": "eslint . --fix",
        "lint:check": "eslint .",
        "type-check": "vue-tsc --noEmit",
        "test": "php artisan test --parallel",
        "test:coverage": "php artisan test --coverage",
        "test:frontend": "vitest",
        "analyze": "php ./vendor/bin/phpstan analyse --memory-limit=32G",
        "analyze:ci": "php ./vendor/bin/phpstan analyse --memory-limit=32G --error-format=github",
        "prepare": "husky install",
        "clean": "rm -rf node_modules vendor",
        "fresh": "npm run clean && composer install && npm install",
        "dev:full": "concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"php artisan pail --timeout=0\" \"npm run dev\" --names=server,queue,logs,vite"
    }
}
```

### Vite Configuration for Performance

```javascript
// vite.config.js optimizations
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', '@inertiajs/vue3'],
                    ui: ['@headlessui/vue', '@heroicons/vue'],
                    utils: ['axios', 'clsx', 'class-variance-authority'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        hmr: {
            host: 'localhost',
        },
    },
})
```

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main, develop]

jobs:
    test-backend:
        runs-on: ubuntu-latest

        services:
            mysql:
                image: mysql:8.0
                env:
                    MYSQL_ROOT_PASSWORD: password
                    MYSQL_DATABASE: autoauto_test
                ports:
                    - 3306:3306
                options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

        steps:
            - uses: actions/checkout@v3

            - name: Setup PHP
              uses: shivammathur/setup-php@v2
              with:
                  php-version: '8.4'
                  extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, iconv, json, mbstring, pdo
                  coverage: xdebug

            - name: Install Composer dependencies
              run: composer install --no-progress --prefer-dist --optimize-autoloader

            - name: Setup Laravel
              run: |
                  cp .env.example .env
                  php artisan key:generate
                  php artisan config:cache
                  php artisan migrate --seed

            - name: Run PHPStan
              run: php vendor/bin/phpstan analyse --memory-limit=32G --error-format=github

            - name: Run Laravel Pint
              run: php vendor/bin/pint --config=/pint.json --test

            - name: Run Tests
              run: php artisan test --parallel --coverage

            - name: Upload coverage to Codecov
              uses: codecov/codecov-action@v3

    test-frontend:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Run ESLint
              run: npm run lint:check

            - name: Run Prettier
              run: npm run format:check

            - name: TypeScript Check
              run: npm run type-check

            - name: Build
              run: npm run build

            - name: Run Frontend Tests
              run: npm run test:frontend

    deploy:
        needs: [test-backend, test-frontend]
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'

        steps:
            - uses: actions/checkout@v3

            - name: Deploy to production
              run: |
                  # Add your deployment script here
                  echo "Deploying to production..."
```

### Code Quality Configuration

```json
// .eslintrc.json enhancements
{
    "extends": [
        "@vue/eslint-config-typescript",
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "vue/multi-word-component-names": "off",
        "vue/no-undef-components": "error",
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/require-default-prop": "error",
        "vue/require-prop-types": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "error",
        "no-var": "error"
    },
    "globals": {
        "route": "readonly",
        "Ziggy": "readonly"
    }
}
```

### Development Environment Setup

```bash
# .env.example additions for development
SENTRY_LARAVEL_DSN=your_sentry_dsn_here
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0

# GoPay configuration
GOPAY_GOID=your_goid
GOPAY_CLIENT_ID=your_client_id
GOPAY_CLIENT_SECRET=your_client_secret
GOPAY_PRODUCTION=false

# Development tools
TELESCOPE_ENABLED=true
DEBUGBAR_ENABLED=true
LOG_LEVEL=debug

# Performance monitoring
QUERY_DETECTOR_ENABLED=true
CLOCKWORK_ENABLE=true
```

This prompt provides comprehensive development workflow management with proper code quality gates and CI/CD integration.
