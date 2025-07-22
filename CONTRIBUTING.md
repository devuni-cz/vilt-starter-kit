# Contributing to LIVT Starter Kit

Thank you for your interest in contributing to the LIVT Starter Kit! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR-USERNAME/livt-starter-kit.git
    cd livt-starter-kit
    ```
3. **Add the upstream repository**:
    ```bash
    git remote add upstream https://github.com/devuni-cz/livt-starter-kit.git
    ```

## 🛠️ Development Setup

### Prerequisites

- PHP 8.4+
- Node.js 18+
- Composer
- Git

### Installation

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database file (SQLite)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Start development environment
composer dev
```

## 🎯 How to Contribute

### Types of Contributions We Welcome

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Test coverage improvements**

### Before You Start

1. **Check existing issues** to see if your idea is already being discussed
2. **Open an issue** to discuss new features before implementing
3. **Keep changes focused** - one feature/fix per pull request

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Follow our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run code formatting
npm run format

# Run PHP tests
composer test

# Run frontend linting
npm run lint:check

# Run static analysis
composer analyse
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to related issues** (if any)
- **Screenshots** (for UI changes)

## 📏 Coding Standards

### PHP (Laravel)

- Follow **PSR-12** coding standards
- Use **Laravel Pint** for code formatting: `composer pint`
- Run **PHPStan** analysis: `composer analyse`
- Write **tests** for new functionality using Pest

### JavaScript/Vue

- Use **ESLint** for linting: `npm run lint`
- Use **Prettier** for formatting: `npm run prettier`
- Follow **Vue 3 Composition API** patterns with `<script setup>`
- Use **TypeScript** types where applicable

### CSS/TailwindCSS

- Use **TailwindCSS utilities** instead of custom CSS when possible
- Follow **responsive design** principles
- Use **semantic class names** for custom components

### General Guidelines

- **Meaningful variable names** and function names
- **Add comments** for complex logic
- **Keep functions small** and focused
- **Remove unused code** and imports

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Laravel version**
- **PHP version**
- **Node.js version**
- **Browser** (for frontend issues)
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)

### Feature Requests

For new features, please provide:

- **Clear description** of the feature
- **Use case** and benefits
- **Possible implementation** approach
- **Alternative solutions** considered

## 🏷️ Issue Labels

We use these labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 🙏 Recognition

Contributors will be:

- **Listed** in our contributors section
- **Mentioned** in release notes (for significant contributions)
- **Invited** to join our community discussions

## 📞 Questions?

- **GitHub Discussions** - For general questions and ideas
- **GitHub Issues** - For bug reports and feature requests
- **Email** - For security concerns or private matters

---

Thank you for contributing to LIVT Starter Kit! 🎉

**Happy coding!** 💻✨
