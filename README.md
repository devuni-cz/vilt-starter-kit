# 🚀 VILT Starter Kit

<div align="center">

![VILT Logo](https://img.shields.io/badge/VILT-Starter%20Kit-red?style=for-the-badge&logo=laravel&logoColor=white)

**A modern, production-ready starter kit combining the power of Laravel, Inertia.js, Vue 3, and TailwindCSS**

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[![Packagist](https://img.shields.io/packagist/v/devuni/vilt-starter-kit?style=flat&logo=packagist&logoColor=white)](https://packagist.org/packages/devuni/vilt-starter-kit)
[![Downloads](https://img.shields.io/packagist/dt/devuni/vilt-starter-kit?style=flat&logo=packagist&logoColor=white)](https://packagist.org/packages/devuni/vilt-starter-kit)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

[What is VILT?](#what-is-vilt) • [Why Choose VILT?](#why-choose-vilt) • [Features](#features) • [Installation](#installation)

</div>

---

## What is VILT?

**VILT** (Laravel + Inertia + Vue + TailwindCSS) is a carefully crafted starter kit that brings together the most powerful modern web development tools. Skip the tedious setup and jump straight into building amazing applications with a battle-tested foundation.

## Why Choose VILT?

- 🏗️ **Production Ready** - Pre-configured with best practices and modern tooling
- 🚀 **Developer Experience** - Hot reloading, TypeScript support, and modern dev tools
- 🔒 **Enterprise Grade** - Built-in error tracking, code quality tools, and testing setup
- 📱 **Modern UI** - TailwindCSS 4.x with responsive design patterns
- ⚡ **Performance First** - Optimized builds, SSR support, and efficient bundling

## Features

### Frontend Stack

| Feature         | Version | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| **Vue 3**       | `3.5.x` | Composition API with `<script setup>` syntax |
| **Inertia.js**  | `2.x`   | SPA experience without API complexity        |
| **TailwindCSS** | `4.x`   | Utility-first CSS framework                  |
| **Vite**        | `7.x`   | Lightning-fast build tool and dev server     |
| **SSR Support** | ✅      | Server-side rendering for better SEO         |

### Backend Stack

| Feature     | Version | Description                               |
| ----------- | ------- | ----------------------------------------- |
| **Laravel** | `12.x`  | Modern PHP framework with latest features |
| **PHP**     | `8.4+`  | Latest PHP with performance improvements  |
| **Ziggy**   | `2.x`   | Use Laravel routes in JavaScript          |
| **Sentry**  | `4.x`   | Error tracking and performance monitoring |

### Development Tools

| Tool             | Purpose                                 |
| ---------------- | --------------------------------------- |
| **ESLint**       | JavaScript/Vue linting with auto-fix    |
| **Prettier**     | Code formatting for consistent style    |
| **Laravel Pint** | PHP code style fixer                    |
| **Larastan**     | Static analysis for Laravel             |
| **Rector**       | Automated code upgrades and refactoring |
| **Pest PHP**     | Modern testing framework                |
| **Husky**        | Git hooks for code quality              |

---

## Installation

### Quick Start (Recommended)

```bash
laravel new my-awesome-app --using=devuni/vilt-starter-kit
```

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/devuni-cz/vilt-starter-kit.git my-project
cd my-project

# Install dependencies
composer install && npm install

# Setup environment
cp .env.example .env
php artisan key:generate
php artisan migrate

# Start development
composer dev
```

Your development environment is ready at `http://localhost:8000` 🎉

---

## Local Development

### Essential Commands

```bash
# Start all services
composer dev

# Individual services
php artisan serve               # Laravel server
npm run dev                     # Vite dev server
php artisan queue:listen        # Queue worker

# Code quality
npm run format                  # Auto-fix all code
npm run lint                    # Check frontend
composer analyse                # PHP analysis

# Database
php artisan migrate             # Run migrations
php artisan migrate:fresh --seed # Fresh DB with data
```

### Project Structure

```
├── app/                    # Laravel application
├── resources/js/
│   ├── components/         # Vue components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Inertia pages
│   └── utils/             # JavaScript utilities
├── routes/                # Application routes
└── tests/                 # Test files
```

---

## Production

### Building for Production

```bash
# Build frontend assets
npm run build

# Build with SSR support
npm run build:ssr

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### SSR Server Setup

For production SSR, run the Inertia SSR server with **Supervisor** (recommended):

Create `/etc/supervisor/conf.d/inertia-ssr.conf`:

```ini
[program:inertia-ssr]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan inertia:start-ssr
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/inertia.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start inertia-ssr:*
```

### Sentry Configuration

The project includes Sentry for error tracking. Configure these environment variables:

```env
# Sentry Configuration
SENTRY_LARAVEL_DSN=your-sentry-dsn-here
SENTRY_TRACES_SAMPLE_RATE=1
SENTRY_AUTH_TOKEN=your-auth-token

# Frontend Sentry (automatically passed from Laravel)
VITE_SENTRY_DSN="${SENTRY_LARAVEL_DSN}"
```

Sentry is pre-configured in `vite.config.js` with:

- **Source maps** for production debugging
- **Release tracking** for deployment monitoring
- **Error reporting** for both frontend and backend

To customize Sentry settings, update the `sentryVitePlugin` configuration in `vite.config.js`.

---

## Contributing

We welcome contributions! See our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test: `npm run format && composer test`
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push and create Pull Request

---

## License

Licensed under the [MIT license](LICENSE).

---

<div align="center">

**Made with ❤️ by [Devuni](https://devuni.cz/)**

⭐ **If this helped you, please give it a star!** ⭐

[🐛 Report Bug](https://github.com/devuni-cz/vilt-starter-kit/issues) • [💡 Request Feature](https://github.com/devuni-cz/vilt-starter-kit/issues)

</div>
