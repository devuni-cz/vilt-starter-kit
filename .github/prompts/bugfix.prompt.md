---
mode: agent
---

# Bug Fix Prompt

## Expected Output Format

When fixing bugs, provide:

1. **Problem analysis** - Clear description of the issue and root cause
2. **Impact assessment** - What functionality is affected
3. **Solution approach** - Step-by-step fix strategy
4. **Code changes** - Minimal, focused changes to resolve the issue
5. **Testing verification** - How to verify the fix works
6. **Regression prevention** - Tests or checks to prevent future occurrences

## Investigation Process

1. **Reproduce the issue** - Understand the exact problem
2. **Identify root cause** - Trace through the code to find the source
3. **Assess impact** - Determine what else might be affected
4. **Design minimal fix** - Smallest change to resolve the issue
5. **Test thoroughly** - Verify fix works and doesn't break other functionality

## Fix Constraints

- Make minimal changes to reduce risk
- Maintain backwards compatibility
- Follow existing code patterns
- Add tests to prevent regression
- Document the fix if complex

## Verification Requirements

- Test the specific bug scenario
- Run existing tests to ensure no regressions
- Check related functionality
- Test edge cases
- Verify in different environments if applicable

## Documentation

- Update comments if the fix changes behavior
- Add inline documentation for complex fixes
- Update relevant documentation files
- Consider adding to troubleshooting guides
