---
mode: agent
---

# Testing Prompt

## Expected Output Format

When creating tests, provide:

1. **Test strategy** - What types of tests are needed
2. **Test structure** - Organized test files and methods
3. **Test data** - Factories, seeders, and mock data
4. **Coverage analysis** - What functionality is being tested
5. **Test documentation** - Clear test descriptions and purposes

## Test Types

### Unit Tests

- Model methods and relationships
- Service class methods
- Utility functions
- Individual component logic
- Data transformations

### Feature Tests

- HTTP endpoints
- Authentication flows
- Complete user journeys
- Integration between components
- Database interactions

### Frontend Tests

- Component rendering
- User interactions
- State management
- API integration
- Form validation

## Test Organization

### Backend Tests (PHPUnit)

- `tests/Unit/` for isolated unit tests
- `tests/Feature/` for integration tests
- Use factories for test data
- Test both success and failure scenarios
- Mock external dependencies

### Frontend Tests

- Component tests for Vue components
- Integration tests for user workflows
- Mock API responses
- Test user interactions
- Test edge cases and error states

## Test Quality Standards

- **Clear test names** - Describe what is being tested
- **Arrange, Act, Assert** pattern
- **Independent tests** - No test dependencies
- **Meaningful assertions** - Test the right things
- **Good test data** - Realistic but controlled data

## Coverage Requirements

- Critical business logic: 100%
- Models and services: 90%+
- Controllers and API endpoints: 80%+
- Components and UI: 70%+
- Focus on testing behavior, not implementation

## Test Maintenance

- Keep tests simple and focused
- Update tests when requirements change
- Remove obsolete tests
- Refactor tests to reduce duplication
- Document complex test scenarios
