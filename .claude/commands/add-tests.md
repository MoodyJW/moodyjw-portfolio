---
description: Add comprehensive unit tests for a component or service
---

Create comprehensive unit tests for the specified component or service.

**Test Coverage Requirements:**
- Target: 85% coverage (80% minimum)
- Test all public methods
- Test signal updates and computed values
- Test error cases and edge cases
- Test component lifecycle hooks
- Test user interactions (clicks, inputs)
- Test async operations (HTTP requests)

**For Components:**
1. Test component initialization
2. Test signal state changes
3. Test user interactions (button clicks, form inputs)
4. Test conditional rendering (@if blocks)
5. Test list rendering (@for loops)
6. Test outputs/event emissions
7. Mock all dependencies (services, stores)
8. Test accessibility (ARIA, roles, keyboard events)

**For Services:**
1. Test all public methods
2. Test HTTP requests (mock HttpClient)
3. Test error handling
4. Test state updates (signals/observables)
5. Test dependency injection
6. Test async operations

**Testing Standards:**
- Use Vitest testing framework
- Use Angular testing utilities (TestBed, ComponentFixture)
- Mock external dependencies
- Test behavior, not implementation
- Clear test descriptions
- Arrange-Act-Assert pattern

**Before creating tests:**
- Ask me which component/service to test
- Read the existing code to understand behavior
- Check if tests already exist and extend them

Create thorough tests following the patterns in existing `.spec.ts` files.
