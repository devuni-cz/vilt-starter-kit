---
mode: agent
---

# Refactoring Prompt

## Expected Output Format

When refactoring code, provide:

1. **Refactoring goals** - What improvements are being made
2. **Impact analysis** - What will change and what stays the same
3. **Migration strategy** - How to safely implement changes
4. **Before/after comparison** - Show the improvements clearly
5. **Testing plan** - How to verify the refactoring is successful
6. **Rollback plan** - How to revert if issues arise

## Refactoring Types

### Code Quality Improvements

- Extract methods and classes
- Reduce code duplication
- Improve naming conventions
- Simplify complex logic
- Remove dead code

### Performance Optimizations

- Database query optimization
- Caching implementation
- Bundle size reduction
- Memory usage improvements
- Algorithm improvements

### Architecture Improvements

- Better separation of concerns
- Design pattern implementation
- Dependency injection
- Service layer extraction
- Component organization

## Safety Requirements

- **Maintain functionality** - No behavior changes
- **Preserve APIs** - Keep public interfaces stable
- **Backwards compatibility** - Don't break existing integrations
- **Comprehensive testing** - Test before and after refactoring
- **Incremental changes** - Small, reviewable changes

## Refactoring Process

1. **Identify the problem** - What needs improvement
2. **Plan the solution** - Design the better approach
3. **Write tests** - Ensure current behavior is tested
4. **Make small changes** - Refactor incrementally
5. **Verify tests pass** - Ensure no regressions
6. **Review and iterate** - Continuous improvement

## Documentation Requirements

- Update code comments
- Revise API documentation
- Update architectural diagrams
- Document migration steps
- Record lessons learned

## Risk Management

- **Feature flags** - Allow rolling back changes
- **Monitoring** - Watch for performance impacts
- **Gradual rollout** - Deploy incrementally
- **Rollback readiness** - Have a quick revert plan
- **Stakeholder communication** - Keep team informed
