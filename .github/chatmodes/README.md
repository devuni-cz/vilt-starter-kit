# Chat Modes for Automotive E-commerce Development

Chat modes define specialized interaction patterns for different types of development tasks in an automotive e-commerce platform built with Laravel + Inertia.js + Vue.js.

## Available Chat Modes

### 🚗 [Automotive Sales](./automotive-sales.md)

**When to use**: Building vehicle sales, parts management, and marketplace features

- **Focus**: Sales workflows, inventory management, customer experience
- **Style**: Business-focused, user experience driven
- **Output**: Complete sales features with proper transaction handling

### 💳 [Payments Integration](./payments-integration.md)

**When to use**: Implementing payment processing with GoPay SDK

- **Focus**: Secure payment handling, financial compliance, transaction management
- **Style**: Security-first, error-handling focused
- **Output**: Robust payment processing with comprehensive error handling

### 📦 [Inventory Management](./inventory-management.md)

**When to use**: Building inventory tracking, parts compatibility, and stock management

- **Focus**: Stock tracking, parts compatibility, inventory optimization
- **Style**: Logistics-focused, real-time oriented
- **Output**: Comprehensive inventory management with real-time updates

### 🚀 [Feature Development](./feature-development.md)

**When to use**: Building new features from scratch

- **Focus**: Full-stack feature implementation
- **Style**: Conversational but structured, step-by-step guidance
- **Output**: Complete working features with tests

### 🐛 [Debugging](./debugging.md)

**When to use**: Troubleshooting issues and bugs

- **Focus**: Systematic problem-solving and root cause analysis
- **Style**: Analytical and methodical, question-driven
- **Output**: Specific fixes with prevention measures

### 📋 [Code Review](./code-review.md)

**When to use**: Reviewing code quality and providing feedback

- **Focus**: Code quality, security, performance, maintainability
- **Style**: Constructive and educational, balanced feedback
- **Output**: Prioritized feedback with learning opportunities

### 🏗️ [Architecture Planning](./architecture-planning.md)

**When to use**: Designing system architecture and planning large features

- **Focus**: Scalable, maintainable solutions using Laravel patterns
- **Style**: Strategic and forward-thinking, pattern-focused
- **Output**: Architecture diagrams and implementation strategies

### ⚡ [Performance Optimization](./performance-optimization.md)

**When to use**: Improving application performance and scalability

- **Focus**: Database, backend, frontend, and infrastructure optimization
- **Style**: Data-driven, systematic approach, ROI-focused
- **Output**: Measurable performance improvements

### 🎓 [Learning & Teaching](./learning-and-teaching.md)

**When to use**: Learning new concepts or teaching development skills

- **Focus**: Educational explanations and skill building
- **Style**: Patient and encouraging, concept-driven
- **Output**: Progressive learning with practical exercises

## Domain-Specific Guidance

### Choose **Automotive Sales** when:

- Building vehicle listing and search features
- Implementing buyer/seller marketplace features
- Creating order management systems
- Working on customer relationship features
- Developing sales analytics and reporting

### Choose **Payments Integration** when:

- Implementing GoPay payment processing
- Building secure transaction handling
- Creating invoice and billing systems
- Working on refund and cancellation features
- Developing financial reporting tools

### Choose **Inventory Management** when:

- Building stock tracking systems
- Implementing parts compatibility features
- Creating warehouse management tools
- Working on supplier integration
- Developing inventory analytics

### Choose **Feature Development** when:

- Building new e-commerce functionality
- Creating user authentication systems
- Implementing admin panels with Filament
- Adding new automotive-specific features
- Developing ERP integration features

## Automotive E-commerce Context

All modes are optimized for:

- **Laravel 12** with modern PHP 8.4+ features
- **Inertia.js v2** for seamless SPA experience
- **Vue.js 3.5** with Composition API and TypeScript
- **Tailwind CSS 4.x** for modern styling
- **Filament 3.x** for admin panels with Shield
- **GoPay SDK** for payment processing
- **Spatie Media Library** for file management
- **Sentry** for error tracking and performance monitoring
- **Lara Zeus QR** for QR code generation
- **Automotive domain** understanding (vehicles, parts, salvage)

## Tech Stack Integration

### Backend Stack

- **Laravel 12** with PHP 8.4+
- **Filament 3.x** admin panels with Shield
- **Spatie packages** for media, sitemap, and utilities
- **GoPay SDK** for payment processing
- **Laravel Socialite** for social authentication
- **Sentry** for error tracking and performance monitoring
- **Lara Zeus QR** for QR code generation

### Frontend Stack

- **Vue.js 3.5** with Composition API and TypeScript
- **Inertia.js v2** for SPA experience
- **Tailwind CSS 4.x** with modern utilities
- **Vite 6.x** for build tooling
- **Ziggy** for Laravel route integration
- **html5-qrcode** for QR code scanning
- **Swiper** for image carousels
- **Headless UI** for accessible components

### Development Tools

- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Husky** and **lint-staged** for Git hooks
- **Laravel Pint** for PHP formatting
- **PHPStan** for static analysis
- **Sentry Vite plugin** for error tracking

## How to Use Chat Modes

### In GitHub Copilot Chat

```
@workspace /mode automotive-sales

I need to add a vehicle comparison feature to my Laravel app.
```

### In AI Assistant Conversations

Start your conversation by referencing the mode:

```
Use the inventory-management chat mode.

I want to build a parts compatibility system for my automotive e-commerce platform.
```

### Switching Between Modes

You can switch modes during a conversation:

```
Switch to payments-integration mode.

The inventory system needs to integrate with GoPay for part purchases.
```

## Best Practices

### Be Specific

- Include relevant code snippets when asking questions
- Mention specific error messages or behaviors
- Provide context about what you're trying to achieve
- Reference the automotive domain when relevant

### Use Mode Strengths

- **Automotive Sales**: Ask for complete marketplace implementations
- **Payments Integration**: Share GoPay integration challenges
- **Inventory Management**: Discuss stock tracking and parts compatibility
- **Feature Development**: Request complete feature implementations
- **Debugging**: Share error logs and reproduction steps

### Combine Modes

- Start with Architecture Planning for big features
- Move to Feature Development for implementation
- Use Inventory Management for stock-related features
- Switch to Payments Integration for transaction features
- Use Performance Optimization for scalability

This project emphasizes automotive e-commerce patterns, secure payment processing, and efficient inventory management through modern Laravel and Vue.js integration.
