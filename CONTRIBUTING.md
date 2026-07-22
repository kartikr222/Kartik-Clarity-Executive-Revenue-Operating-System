/**
 * Contributing Guidelines
 *
 * ## Code Standards
 *
 * ### TypeScript
 * - Always use strict mode
 * - No `any` types - use proper typing
 * - Explicit return types on functions
 * - Interface over type for objects
 *
 * ### Components
 * - Functional components only (React 19)
 * - Use TypeScript for props
 * - Extract PropTypes into interfaces
 * - Use React.ReactElement for return type
 *
 * ### Code Style
 * - Run `pnpm format` before committing
 * - Run `pnpm lint` to check for issues
 * - Run `pnpm type-check` for type safety
 * - All tests must pass: `pnpm test`
 *
 * ### Testing
 * - Write tests alongside features
 * - Aim for >80% coverage
 * - Use descriptive test names
 * - Test user behavior, not implementation
 *
 * ### Git Workflow
 * - Create feature branches from main
 * - Branch naming: feature/description or fix/description
 * - Commit messages should be descriptive
 * - Push to feature branch and create PR
 *
 * ### PR Requirements
 * - All tests passing
 * - No TypeScript errors
 * - No ESLint errors
 * - Code review approval
 *
 * ## File Structure
 *
 * - Keep files small and focused
 * - Group related files in directories
 * - Use index.ts for barrel exports
 * - Co-locate tests with source files
 *
 * ## Naming Conventions
 *
 * - Components: PascalCase (Button.tsx)
 * - Utilities: camelCase (formatDate.ts)
 * - Constants: UPPER_SNAKE_CASE
 * - Types: PascalCase (User, ApiResponse)
 * - Files: Match export names
 *
 * ## Documentation
 *
 * - Document complex logic with comments
 * - Update ARCHITECTURE.md for structural changes
 * - Update README.md for user-facing changes
 * - JSDoc comments for public APIs
 *
 */

export {};
