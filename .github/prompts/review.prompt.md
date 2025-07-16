---
mode: agent
---

# Code Review Prompt

## Expected Output Format

When reviewing code, provide:

1. **Overall assessment** - Summary of code quality and adherence to standards
2. **Specific feedback** - Line-by-line comments on improvements
3. **Security review** - Potential security vulnerabilities
4. **Performance analysis** - Potential performance issues
5. **Best practices** - Suggestions for better code organization
6. **Testing recommendations** - Missing or inadequate tests

## Review Categories

### Code Quality

- Follows project coding standards
- Proper naming conventions
- Code readability and maintainability
- DRY principle adherence
- Single responsibility principle

### Security

- Input validation and sanitization
- Authentication and authorization
- SQL injection prevention
- XSS protection
- CSRF protection

### Performance

- Database query optimization
- N+1 query prevention
- Caching opportunities
- Bundle size impact
- Memory usage

### Architecture

- Proper separation of concerns
- Design pattern usage
- Dependencies and coupling
- Error handling
- Logging implementation

## Feedback Format

- **Positive feedback** - Highlight good practices
- **Constructive criticism** - Specific suggestions for improvement
- **Priority levels** - Critical, Important, Nice-to-have
- **Code examples** - Show better alternatives when possible
- **Learning opportunities** - Explain why certain approaches are better

## Review Standards

- Be specific and actionable
- Focus on code, not the person
- Provide examples and alternatives
- Consider the context and constraints
- Balance perfectionism with pragmatism
