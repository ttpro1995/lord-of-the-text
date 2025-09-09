# Getting Started for Contributors

Welcome to the Lord of the Text project! This guide will help you set up your development environment and contribute to the game.

## Prerequisites

### System Requirements
- Node.js version 16 or higher (recommended: 18 LTS)
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome/Safari/Firefox)

### Recommended Development Tools
- VS Code editor with React extensions
- GitHub Desktop (optional for GUI)
- Browser developer tools
- Terminal/command line interface

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lord-of-the-text
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to access the game.

### 4. Verify Installation
- Check console for any errors
- Resources should increment automatically
- UI should display properly

## Project Structure

- `src/` - Main application code
  - `components/` - React components
  - `reducers/` - State management (useReducer)
  - `data/` - Game data files (building definitions, etc.)
- `tests/` - Test files
- `docs/` - Documentation
- `vibe-doc/` - Development planning documents

## Contribution Guidelines

### Code Style
- Use consistent naming (camelCase for variables/functions)
- Add comments for complex logic
- Keep functions small and focused

### State Management
- Use the provided `useReducer` pattern
- Document any new state additions
- Ensure state updates trigger appropriate UI changes

### Testing
- Add tests for new features in `tests/`
- Run tests with `npm test`
- Ensure tests pass before submitting PRs

### Documentation
- Update docs/ for any new features
- Keep getting-started.md current
- Document breaking changes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Execute tests with Vitest

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update docs

3. **Test Changes**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: brief description of changes"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/new-feature-name
   ```

## Common Issues

### Build Fails
- Check Node.js version: `node --version`
- Try clearing cache: `npm run clean` (if available)
- Verify dependencies: `npm install`

### Tests Fail
- Run specific test: `npm test -- -t "test name"`
- Check test setup in `tests/setup.js`
- Ensure new code is properly tested

### Game Not Starting
- Check console for errors
- Verify port 5173 is available
- Try different browser

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

## Getting Help

- Create an issue on GitHub
- Tag with appropriate labels
- Provide detailed reproduction steps