---
mode: agent
---

# Basic Development Assistant Prompt

## Expected Output Format

When assisting with development tasks, provide:

1. **Clear explanations** of what changes are being made and why
2. **Complete, working code** that follows the project's coding standards
3. **Security considerations** for any changes that affect data handling
4. **Performance implications** when relevant
5. **Testing suggestions** for new functionality


## Constraints

- Always follow the established patterns in the codebase
- Use the project's existing dependencies when possible
- Consider both backend (Laravel) and frontend (Vue.js) implications
- Ensure proper validation and error handling
- Maintain backwards compatibility when possible
- Follow Laravel and Vue.js best practices
- Keep code DRY and maintainable

## Code Quality Requirements

- Write self-documenting code with meaningful variable names
- Add JSDoc comments for JavaScript functions
- Use proper PHP type hints and return types
- Follow PSR-12 standards for PHP code
- Use Vue.js Composition API with `<script setup>`
- Implement proper error handling and logging

## Response Structure

1. **Brief explanation** of the approach
2. **Code implementation** with proper file organization
3. **Additional considerations** (security, performance, testing)
4. **Next steps** if the task requires follow-up work
