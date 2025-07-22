# 🚀 LIVT Starter Kit

<div align="center">

![LIVT Logo](https://img.shields.io/badge/LIVT-Starter%20Kit-red?style=for-the-badge&logo=laravel&logoColor=white)

**A modern, production-ready starter kit combining the power of Laravel, Inertia.js, Vue 3, and TailwindCSS**

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

[![Packagist](https://img.shields.io/packagist/v/devuni/livt-starter-kit?style=flat&logo=packagist&logoColor=white)](https://packagist.org/packages/devuni/livt-starter-kit)
[![Downloads](https://img.shields.io/packagist/dt/devuni/livt-starter-kit?style=flat&logo=packagist&logoColor=white)](https://packagist.org/packages/devuni/livt-starter-kit)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

[Installation](#-installation) • [Features](#-features) • [Development](#-development) • [Documentation](#-documentation)

</div>

---

## 🎯 What is LIVT?

**LIVT** (Laravel + Inertia + Vue + TailwindCSS) is a carefully crafted starter kit that brings together the most powerful modern web development tools. Skip the tedious setup and jump straight into building amazing applications with a battle-tested foundation.

### ✨ Why Choose LIVT?

- 🏗️ **Production Ready** - Pre-configured with best practices and modern tooling
- 🚀 **Developer Experience** - Hot reloading, TypeScript support, and modern dev tools
- 🔒 **Enterprise Grade** - Built-in error tracking, code quality tools, and testing setup
- 📱 **Modern UI** - TailwindCSS 4.x with responsive design patterns
- ⚡ **Performance First** - Optimized builds, SSR support, and efficient bundling

---

## 🚀 Installation

### Quick Start (Recommended)

Create a new LIVT project using Laravel's installer:

```bash
laravel new my-awesome-app --using=devuni/livt-starter-kit
```

### Alternative Installation

```bash
# Clone the repository
git clone https://github.com/devuni-cz/livt-starter-kit.git my-project
cd my-project

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Start development servers
composer dev
```

That's it! 🎉 Your development environment is ready at `http://localhost:8000`

---

## 🛠️ Features

### 🎨 Frontend Stack

| Feature         | Version | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| **Vue 3**       | `3.5.x` | Composition API with `<script setup>` syntax |
| **Inertia.js**  | `2.x`   | SPA experience without API complexity        |
| **TailwindCSS** | `4.x`   | Utility-first CSS framework                  |
| **Vite**        | `7.x`   | Lightning-fast build tool and dev server     |
| **SSR Support** | ✅      | Server-side rendering for better SEO         |

### 🛡️ Backend Stack

| Feature     | Version | Description                               |
| ----------- | ------- | ----------------------------------------- |
| **Laravel** | `12.x`  | Modern PHP framework with latest features |
| **PHP**     | `8.4+`  | Latest PHP with performance improvements  |
| **Ziggy**   | `2.x`   | Use Laravel routes in JavaScript          |
| **Sentry**  | `4.x`   | Error tracking and performance monitoring |

### 🧰 Development Tools

<details>
<summary><strong>Code Quality & Linting</strong></summary>

- **ESLint** - JavaScript/Vue linting with auto-fix
- **Prettier** - Code formatting for consistent style
- **Laravel Pint** - PHP code style fixer
- **Larastan** - Static analysis for Laravel
- **Rector** - Automated code upgrades and refactoring

</details>

<details>
<summary><strong>Testing & Quality Assurance</strong></summary>

- **Pest PHP** - Modern testing framework
- **PHPStan** - Static analysis for PHP
- **Laravel Debugbar** - Development debugging tools

</details>

<details>
<summary><strong>Developer Experience</strong></summary>

- **Husky** - Git hooks for code quality
- **Lint-staged** - Run linters on staged files
- **Hot Module Replacement** - Instant updates during development
- **Auto-imports** - Unused import detection and cleanup

</details>

---

## 🚦 Development

### Available Commands

```bash
# Start all development services (recommended)
composer dev

# Individual commands
php artisan serve          # Laravel development server
npm run dev                # Vite development server
php artisan queue:listen   # Queue worker
php artisan pail           # Real-time logs

# Building for production
npm run build              # Build frontend assets
npm run build:ssr          # Build with SSR support

# Code quality
npm run format             # Format all code (Prettier + Pint + ESLint)
npm run lint               # Run ESLint
composer analyse           # Run PHPStan analysis
composer rector            # Run Rector refactoring
```

### Project Structure

```
├── app/                    # Laravel application code
├── resources/
│   ├── js/
│   │   ├── components/     # Vue components
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Inertia pages
│   │   └── utils/          # JavaScript utilities
│   ├── css/                # Stylesheets
│   └── views/              # Blade templates
├── routes/                 # Application routes
├── database/               # Migrations and seeders
└── tests/                  # Test files
```

---

## 📚 Documentation

### 🎓 Learning Resources

- **[Laravel Documentation](https://laravel.com/docs)** - Comprehensive Laravel guide
- **[Inertia.js Guide](https://inertiajs.com/)** - Building SPAs with server-side routing
- **[Vue 3 Documentation](https://vuejs.org/)** - Modern Vue.js development

### 🔧 Configuration

<details>
<summary><strong>Environment Setup</strong></summary>

Key environment variables in `.env`:

```env
# Application
APP_NAME="My LIVT App"
APP_ENV=local
APP_DEBUG=true

# Database
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Sentry (Optional)
SENTRY_LARAVEL_DSN=your-sentry-dsn
```

</details>

<details>
<summary><strong>AppServiceProvider Configuration</strong></summary>

The `AppServiceProvider` includes several production-ready optimizations:

**Development Environment (`local`):**
- `Model::preventLazyLoading()` - Prevents N+1 query issues
- `Model::shouldBeStrict()` - Enables strict mode for better debugging

**Production Environment (`production`):**
- `$this->app['request']->server->set('HTTPS', true)` - Forces HTTPS
- `DB::prohibitDestructiveCommands()` - Prevents accidental data loss

**Global Optimizations:**
- `Date::useClass(CarbonImmutable::class)` - Immutable date objects
- `JsonResource::withoutWrapping()` - Clean API responses
- `Vite::prefetch(concurrency: 3)` - Asset prefetching for performance

</details>

<details>
<summary><strong>Production SSR Setup</strong></summary>

For Server-Side Rendering in production, you need to run the SSR server continuously. Here are two recommended approaches:

**Option 1: Supervisor (Recommended)**

Create `/etc/supervisor/conf.d/inertia-ssr.conf`:

```ini
[program:inertia-ssr]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan inertia:start-ssr
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/inertia.log
stderr_logfile=/var/www/html/storage/logs/inertia.error.log
user=www-data
```

Then run:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start inertia-ssr:*
```

**Option 2: Screen Session**

```bash
# Start screen session
screen -S inertia-ssr

# Run SSR server
php artisan inertia:start-ssr

# Detach with Ctrl+A, D
# Reattach with: screen -r inertia-ssr
```

**Option 3: PM2 (Node.js Process Manager)**

```bash
pm2 start --name="inertia-ssr" php -- artisan inertia:start-ssr
pm2 save
pm2 startup
```

</details>

<details>
<summary><strong>Customization</strong></summary>

- **TailwindCSS Config**: `tailwind.config.js`
- **Vite Config**: `vite.config.js`
- **ESLint Config**: `eslint.config.js`
- **TypeScript**: Add `tsconfig.json` for TypeScript support

</details>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run format && composer test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

---

## 🙏 Acknowledgments

- **[Laravel](https://laravel.com)** - The PHP framework for web artisans
- **[Inertia.js](https://inertiajs.com)** - The modern monolith
- **[Vue.js](https://vuejs.org)** - The progressive JavaScript framework
- **[TailwindCSS](https://tailwindcss.com)** - Rapidly build modern websites

---

<div align="center">

**Made with ❤️ by [Devuni](https://github.com/devuni-cz)**

⭐ **If this project helped you, please consider giving it a star!** ⭐

[🐛 Report Bug](https://github.com/devuni-cz/livt-starter-kit/issues) • [💡 Request Feature](https://github.com/devuni-cz/livt-starter-kit/issues) • [💬 Discussions](https://github.com/devuni-cz/livt-starter-kit/discussions)

</div>
