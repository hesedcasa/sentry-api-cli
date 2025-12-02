# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
# Install dependencies
npm install

# Build the TypeScript source
npm run build

# Run the CLI (development mode with tsx)
npm start

# Run in development (same as start)
npm run dev

# Run tests
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:ui             # Run tests with UI
npm run test:coverage       # Run tests with coverage report

# Code quality
npm run format              # Format code with ESLint and Prettier
npm run find-deadcode       # Find unused exports with ts-prune
npm run pre-commit          # Run format + find-deadcode
```

## Project Architecture

This is a **Sentry API CLI tool** that provides both interactive REPL and headless modes for Sentry error tracking operations.

### Project Structure

```
src/
├── index.ts                               # Main entry point
├── cli/
│   ├── index.ts                           # Barrel export
│   └── wrapper.ts                         # CLI class with REPL logic
├── commands/
│   ├── index.ts                           # Barrel export
│   ├── helpers.ts                         # Command info helpers
│   └── runner.ts                          # Headless command execution
├── config/
│   ├── index.ts                           # Barrel export
│   └── constants.ts                       # Command definitions
└── utils/
    ├── index.ts                           # Barrel export
    ├── argParser.ts                       # Command-line argument parser
    ├── config-loader.ts                   # YAML config file loader
    ├── sentry-client.ts                   # Sentry API wrapper functions
    └── sentry-utils.ts                    # Core Sentry utility class

tests/
└── unit/
    └── utils/
        └── config-loader.test.ts          # Tests for config loading
```

### Core Components

#### Entry Point (`src/index.ts`)

- Bootstraps the application
- Parses command-line arguments via `parseArguments()`
- Routes to interactive REPL or headless mode

#### CLI Module (`src/cli/`)

- **wrapper class**: Main orchestrator managing:
  - `connect()` - Loads configuration from `.claude/sentry-connector.local.md`
  - `start()` - Initiates interactive REPL with readline interface
  - `handleCommand()` - Parses and processes user commands
  - `runCommand()` - Executes Sentry commands with result formatting
  - `disconnect()` - Graceful cleanup on exit signals (SIGINT/SIGTERM)
  - Custom prompt: `sentry>`

#### Commands Module (`src/commands/`)

- `helpers.ts` - Display command information and help
  - `printAvailableCommands()` - Lists all 13 available commands
  - `printCommandDetail(command)` - Shows detailed help for specific command
  - `getCurrentVersion()` - Reads version from package.json
- `runner.ts` - Execute commands in headless mode
  - `runCommand(command, arg, flag)` - Non-interactive command execution

#### Config Module (`src/config/`)

- `constants.ts` - Centralized configuration
  - `COMMANDS[]` - Array of 13 available Sentry command names
  - `COMMANDS_INFO[]` - Brief descriptions for each command
  - `COMMANDS_DETAIL[]` - Detailed parameter documentation with examples

#### Utils Module (`src/utils/`)

- `argParser.ts` - Command-line argument handling
  - `parseArguments(args)` - Parses CLI flags and routes execution
- `config-loader.ts` - Configuration file management
  - `loadConfig(projectRoot)` - Loads `.claude/sentry-connector.local.md`
  - `getSentryClientOptions(config, profileName)` - Builds Sentry client options
  - TypeScript interfaces: `Config`, `SentryProfile`, `SentryClientOptions`
- `sentry-client.ts` - Sentry API wrapper functions
  - Exports 13 functions: `listProjectEvents()`, `listProjectIssues()`, `listOrgIssues()`, `getIssue()`, `updateIssue()`, `listIssueEvents()`, `getEvent()`, `getIssueEvent()`, `getTagDetails()`, `listTagValues()`, `listIssueHashes()`, `debugSourceMaps()`, `testConnection()`, `clearClients()`
  - Manages singleton `SentryUtil` instance
- `sentry-utils.ts` - Core Sentry utility class
  - `SentryUtil` class - Client pooling and API calls
  - Implements all 13 Sentry commands
  - Formats results as JSON or TOON
  - Uses Axios for HTTP requests to Sentry API

### Configuration System

The CLI loads Sentry profiles from `.claude/sentry-connector.local.md` with YAML frontmatter:

```yaml
---
profiles:
  production:
    authToken: YOUR_AUTH_TOKEN_HERE
    organization: your-org-slug
    baseUrl: https://sentry.io/api/0 # optional, defaults to https://sentry.io/api/0

defaultProfile: production
defaultFormat: json
---
```

**Key behaviors:**

- Profiles are referenced by name in commands
- Multiple profiles support different Sentry organizations (production, staging, etc.)
- Configuration is validated on load with clear error messages
- Auth tokens are used for API authentication
- Base URL defaults to `https://sentry.io/api/0` if not specified

### REPL Interface

- Custom prompt: `sentry>`
- **Special commands**: `help`, `commands`, `profiles`, `profile <name>`, `format <type>`, `clear`, `exit/quit/q`
- **Sentry commands**: 13 commands accepting JSON arguments
  1. `list-project-events` - List a project's error events
  2. `list-project-issues` - List a project's issues
  3. `list-org-issues` - List an organization's issues
  4. `get-issue` - Retrieve an issue
  5. `update-issue` - Update an issue
  6. `list-issue-events` - List an issue's events
  7. `get-event` - Retrieve an event for a project
  8. `get-issue-event` - Retrieve an issue event
  9. `get-tag-details` - Retrieve tag details for an issue
  10. `list-tag-values` - List a tag's values for an issue
  11. `list-issue-hashes` - List an issue's hashes
  12. `debug-source-maps` - Debug issues related to source maps
  13. `test-connection` - Test Sentry API connection

### TypeScript Configuration

- **Target**: ES2022 modules (package.json `"type": "module"`)
- **Output**: Compiles to `dist/` directory with modular structure
- **Declarations**: Generates `.d.ts` files for all modules
- **Source Maps**: Enabled for debugging

## Available Commands

The CLI provides **13 Sentry API commands**:

1. **list-project-events** - List a project's error events
2. **list-project-issues** - List a project's issues
3. **list-org-issues** - List an organization's issues
4. **get-issue** - Retrieve an issue
5. **update-issue** - Update an issue
6. **list-issue-events** - List an issue's events
7. **get-event** - Retrieve an event for a project
8. **get-issue-event** - Retrieve an issue event
9. **get-tag-details** - Retrieve tag details for an issue
10. **list-tag-values** - List a tag's values for an issue
11. **list-issue-hashes** - List an issue's hashes
12. **debug-source-maps** - Debug issues related to source maps
13. **test-connection** - Test Sentry API connection

### Command Examples

```bash
# Start the CLI in interactive mode
npm start

# Inside the REPL:
sentry> commands                                    # List all 13 commands
sentry> help                                        # Show help
sentry> profiles                                    # List available profiles
sentry> profile production                          # Switch profile
sentry> format json                                 # Change output format
sentry> list-project-issues '{"projectSlug":"my-project"}'
sentry> get-issue '{"issueId":"123456789"}'
sentry> list-org-issues '{"query":"is:unresolved","limit":50}'
sentry> update-issue '{"issueId":"123456789","status":"resolved"}'
sentry> exit                                        # Exit

# Headless mode (one-off commands):
npx sentry-cli test-connection '{"profile":"production"}'
npx sentry-cli list-project-issues '{"projectSlug":"my-project"}'
npx sentry-cli get-issue '{"issueId":"123456789","format":"json"}'
npx sentry-cli --commands        # List all commands
npx sentry-cli get-issue -h      # Command-specific help
npx sentry-cli --help            # General help
npx sentry-cli --version         # Show version
```

## Code Structure & Module Responsibilities

### Entry Point (`index.ts`)

- Minimal bootstrapper
- Imports and coordinates other modules
- Handles top-level error catching

### CLI Class (`cli/wrapper.ts`)

- Interactive REPL management
- Configuration loading and profile switching
- User command processing
- Sentry command execution with result formatting
- Graceful shutdown handling

### Command Helpers (`commands/helpers.ts`)

- Pure functions for displaying command information
- No external dependencies except config
- Easy to test

### Command Runner (`commands/runner.ts`)

- Headless/non-interactive execution
- Single command → result → exit pattern
- Independent configuration loading per execution

### Constants (`config/constants.ts`)

- Single source of truth for all command definitions
- Command names, descriptions, and parameter documentation
- No logic, just data

### Config Loader (`utils/config-loader.ts`)

- Reads and parses `.claude/sentry-connector.local.md`
- Extracts YAML frontmatter with Sentry profiles
- Validates required fields for each profile (`authToken`, `organization`)
- Provides default values for settings (`baseUrl` defaults to `https://sentry.io/api/0`)
- Builds Sentry client options

### Sentry Client (`utils/sentry-client.ts`)

- Wrapper functions for all Sentry operations
- Manages singleton SentryUtil instance
- Exports clean async functions for each command

### Sentry Utils (`utils/sentry-utils.ts`)

- Core Sentry API interaction logic
- Client pooling per profile
- API call execution via Axios
- Result formatting (JSON, TOON)
- All 13 command implementations

### Argument Parser (`utils/argParser.ts`)

- CLI flag parsing (--help, --version, --commands, etc.)
- Routing logic for different execution modes
- Command detection and validation

### Key Implementation Details

- **Barrel Exports**: Each module directory has `index.ts` exporting public APIs
- **ES Modules**: All imports use `.js` extensions (TypeScript requirement)
- **Argument Parsing**: Supports JSON arguments for command parameters
- **Client Pooling**: Reuses Sentry clients per profile for efficiency
- **Signal Handling**: Graceful shutdown on Ctrl+C (SIGINT) and SIGTERM
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Configuration**: YAML frontmatter in `.claude/sentry-connector.local.md`
- **HTTP Client**: Uses Axios for Sentry API requests

## Dependencies

**Runtime**:

- `axios@^1.7.9` - HTTP client for Sentry API calls
- `yaml@^2.8.1` - YAML parser for config files
- `@toon-format/toon@^2.0.1` - TOON format encoder

**Development**:

- `typescript@^5.0.0` - TypeScript compiler
- `tsx@^4.0.0` - TypeScript execution runtime
- `vitest@^4.0.9` - Test framework
- `eslint@^9.39.1` - Linting
- `prettier@3.7.1` - Code formatting
- `ts-prune@^0.10.3` - Find unused exports

## Testing

This project uses **Vitest** for testing with the following configuration:

- **Test Framework**: Vitest with globals enabled
- **Test Files**: `tests/**/*.test.ts`
- **Coverage**: V8 coverage provider with text, JSON, and HTML reports

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
tests/
└── unit/
    └── utils/
        └── config-loader.test.ts      # Config loading and validation
```

## Important Notes

1. **Configuration Required**: CLI requires `.claude/sentry-connector.local.md` with valid Sentry profiles
2. **ES2022 Modules**: Project uses `"type": "module"` - no CommonJS
3. **API Authentication**: Uses Sentry auth tokens for authentication
4. **Multi-Profile**: Supports multiple Sentry organizations (production, staging, etc.)
5. **Flexible Output**: JSON or TOON formats for different use cases
6. **Client Pooling**: Reuses clients per profile for better performance

## Commit Message Convention

**Always use Conventional Commits format** for all commit messages and PR titles:

- `feat:` - New features or capabilities
- `fix:` - Bug fixes
- `docs:` - Documentation changes only
- `refactor:` - Code refactoring without changing functionality
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks, dependency updates, build configuration

**Examples:**

```
feat: add debug-source-maps command for source map debugging
fix: handle connection timeout errors gracefully
docs: update configuration examples in README
refactor: extract API formatting into separate module
test: add integration tests for Sentry operations
chore: update axios to latest version
```

When creating pull requests, the PR title must follow this format.
