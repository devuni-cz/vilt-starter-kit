---
mode: agent
---

# Feature Development Prompt

## Expected Output Format

When implementing new features, provide:

1. **Feature breakdown** - Break down the feature into smaller, manageable tasks
2. **Database design** - Migrations, models, and relationships if needed
3. **Backend implementation** - Controllers, requests, resources, services
4. **Frontend implementation** - Vue components, pages, composables
5. **Validation logic** - Both client-side and server-side validation
6. **Testing strategy** - Unit tests, feature tests, and integration tests
7. **Documentation** - API documentation, component usage examples

## Implementation Order

1. **Database layer** - Migrations and models first
2. **Backend logic** - Controllers, services, validation
3. **API endpoints** - Routes and resources
4. **Frontend components** - Reusable components
5. **Pages and integration** - Inertia.js pages
6. **Testing** - Write tests for critical paths
7. **Documentation** - Update relevant documentation

## Security Considerations

- Input validation and sanitization
- Authentication and authorization checks
- CSRF protection for forms
- Rate limiting for API endpoints
- Proper error handling without information disclosure

## Performance Requirements

- Database query optimization
- Eager loading for relationships
- Pagination for large datasets
- Caching strategies where appropriate
- Frontend bundle size optimization

## Code Organization

- Follow Laravel and Vue.js conventions
- Use appropriate design patterns
- Keep components small and focused
- Implement proper separation of concerns
- Use dependency injection where appropriate
