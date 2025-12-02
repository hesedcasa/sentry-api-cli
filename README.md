# Sentry API CLI

[![npm sentry-cli package](https://img.shields.io/npm/v/sentry-cli.svg)](https://npmjs.org/package/sentry-cli)

A powerful command-line interface for Sentry API interaction with support for issues, events, projects, and multiple output formats.

## Features

- 💻 **Interactive REPL** for Sentry exploration and management
- 🚀 **Headless mode** for one-off command execution and automation
- 🔐 **Multi-profile support** for managing different Sentry organizations
- 📊 **Multiple output formats**: JSON or TOON
- 🎯 **Issue management**: retrieve, update, and query issues
- 📋 **Event operations**: list and view project events
- 🔍 **Advanced querying** for issue filtering
- 🗺️ **Source map debugging** for error troubleshooting
- 🏷️ **Tag operations**: retrieve tag details and values
- ✅ **Connection testing** for quick diagnostics

## Requirements

- [Node.js](https://nodejs.org/) v22.0 or newer
- [npm](https://www.npmjs.com/)
- Sentry account with API access

## Installation

```bash
npm install -g sentry-cli
```

## Configuration

### Step 1: Create Auth Token

1. Go to your Sentry organization settings
2. Navigate to **Developer Settings** → **Auth Tokens**
3. Click "Create New Token"
4. Give it appropriate scopes (e.g., project:read, project:write)
5. Copy the generated token

### Step 2: Create Configuration File

Create a configuration file at `.claude/sentry-connector.local.md` in your project root:

```markdown
---
profiles:
  production:
    authToken: YOUR_AUTH_TOKEN_HERE
    organization: your-org-slug
    baseUrl: https://sentry.io/api/0

defaultProfile: production
defaultFormat: json
---

# Sentry API Configuration

This file stores your Sentry API connection profiles.
```

### Configuration Options

- **profiles**: Named Sentry connection profiles
  - `authToken`: Your Sentry API authentication token
  - `organization`: Your Sentry organization slug
  - `baseUrl`: Sentry API base URL (optional, defaults to https://sentry.io/api/0)

- **defaultProfile**: Profile name to use when none specified
- **defaultFormat**: Default output format (`json` or `toon`)

### Multiple Profiles Example

```yaml
---
profiles:
  production:
    authToken: prod_token_here
    organization: my-company
    baseUrl: https://sentry.io/api/0

  staging:
    authToken: staging_token_here
    organization: my-company-staging
    baseUrl: https://sentry.io/api/0

defaultProfile: production
defaultFormat: json
---
```

## Quick Start

### Interactive Mode

Start the CLI and interact with Sentry through a REPL:

```bash
npx sentry-cli
```

Once started, you'll see the `sentry>` prompt:

```
sentry> list-project-issues {"projectSlug":"my-project"}
sentry> get-issue {"issueId":"123456789"}
sentry> list-org-issues {"query":"is:unresolved","limit":50}
```

### Headless Mode

Execute single commands directly:

```bash
# Test connection
npx sentry-cli test-connection

# List project issues
npx sentry-cli list-project-issues '{"projectSlug":"my-project"}'

# Get issue details
npx sentry-cli get-issue '{"issueId":"123456789"}'

# List organization issues
npx sentry-cli list-org-issues '{"query":"is:unresolved","limit":50}'

# Update an issue
npx sentry-cli update-issue '{"issueId":"123456789","status":"resolved"}'
```

## Available Commands

### Issue Commands

- **list-project-issues** - List a project's issues

  ```bash
  sentry> list-project-issues {"projectSlug":"my-project"}
  sentry> list-project-issues {"projectSlug":"my-project","query":"is:unresolved"}
  ```

- **list-org-issues** - List an organization's issues

  ```bash
  sentry> list-org-issues
  sentry> list-org-issues {"query":"is:unresolved","limit":50}
  ```

- **get-issue** - Retrieve an issue

  ```bash
  sentry> get-issue {"issueId":"123456789"}
  ```

- **update-issue** - Update an issue

  ```bash
  sentry> update-issue {"issueId":"123456789","status":"resolved"}
  sentry> update-issue {"issueId":"123456789","isBookmarked":true}
  ```

- **list-issue-events** - List an issue's events

  ```bash
  sentry> list-issue-events {"issueId":"123456789"}
  ```

- **list-issue-hashes** - List an issue's hashes
  ```bash
  sentry> list-issue-hashes {"issueId":"123456789"}
  ```

### Event Commands

- **list-project-events** - List a project's error events

  ```bash
  sentry> list-project-events {"projectSlug":"my-project"}
  ```

- **get-event** - Retrieve an event for a project

  ```bash
  sentry> get-event {"projectSlug":"my-project","eventId":"abc123"}
  ```

- **get-issue-event** - Retrieve an issue event
  ```bash
  sentry> get-issue-event {"issueId":"123456789","eventId":"abc123"}
  ```

### Tag Commands

- **get-tag-details** - Retrieve tag details for an issue

  ```bash
  sentry> get-tag-details {"issueId":"123456789","tagKey":"browser"}
  ```

- **list-tag-values** - List a tag's values for an issue
  ```bash
  sentry> list-tag-values {"issueId":"123456789","tagKey":"environment"}
  ```

### Debug Commands

- **debug-source-maps** - Debug issues related to source maps
  ```bash
  sentry> debug-source-maps {"projectSlug":"my-project"}
  ```

### Utility Commands

- **test-connection** - Test Sentry API connection
  ```bash
  sentry> test-connection
  ```

## Interactive Mode Commands

Special commands available in the REPL:

- **commands** - List all available commands
- **help** or **?** - Show help message
- **profile \<name\>** - Switch to a different profile
- **profiles** - List all available profiles
- **format \<type\>** - Set output format (json, toon)
- **clear** - Clear the screen
- **exit**, **quit**, or **q** - Exit the CLI

## Output Formats

### JSON Format

Machine-readable JSON format (default):

```bash
sentry> format json
sentry> list-project-issues {"projectSlug":"my-project"}
```

### TOON Format

[Token-Oriented Object Notation](https://github.com/toon-format/toon) for AI-optimized output:

```bash
sentry> format toon
sentry> list-org-issues
```

## Security

⚠️ **Important Security Notes:**

1. **Never commit** `.claude/sentry-connector.local.md` to version control
2. Add `*.local.md` to your `.gitignore`
3. Keep your API tokens secure and rotate them periodically
4. Use different API tokens for different environments
5. API tokens have the same permissions as your user account

## Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/hesedcasa/sentry-cli.git
cd sentry-cli

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm start
```

### Run Tests

```bash
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
```

### Code Quality

```bash
npm run format              # Format code with ESLint and Prettier
npm run find-deadcode       # Find unused exports
npm run pre-commit          # Run format + find-deadcode
```

## Examples

### Basic Workflow

```bash
# Start interactive mode
npx sentry-cli

# List all projects' issues
sentry> list-org-issues

# Find unresolved issues
sentry> list-org-issues {"query":"is:unresolved","limit":10}

# Get specific issue
sentry> get-issue {"issueId":"123456789"}

# Update issue
sentry> update-issue {"issueId":"123456789","status":"resolved"}

# List issue events
sentry> list-issue-events {"issueId":"123456789"}

# Debug source maps
sentry> debug-source-maps {"projectSlug":"my-project"}
```

### Automation Scripts

```bash
#!/bin/bash
# Get all unresolved issues
npx sentry-cli list-org-issues '{"query":"is:unresolved","limit":100}' > issues.json

# Test connection
npx sentry-cli test-connection

# Resolve multiple issues from script
for issue_id in $(cat issue_ids.txt); do
  npx sentry-cli update-issue "{\"issueId\":\"$issue_id\",\"status\":\"resolved\"}"
done

# Get project events
npx sentry-cli list-project-events '{"projectSlug":"my-project"}' > events.json
```

## Troubleshooting

### Connection Issues

```bash
# Test your connection
npx sentry-cli test-connection

# Common issues:
# 1. Invalid auth token - regenerate token
# 2. Wrong organization slug - check organization settings
# 3. Incorrect base URL - ensure https:// prefix
```

### Authentication Errors

- Verify your auth token is correct
- Check that the organization slug matches your Sentry organization
- Ensure the base URL is correct (defaults to https://sentry.io/api/0)

### Permission Errors

- API tokens have specific scopes - verify your token has necessary permissions
- Check that your Sentry account has access to the project/organization
- Some operations require specific Sentry permissions

## License

Apache-2.0

## Acknowledgments

Built with [Axios](https://axios-http.com/) for HTTP requests and [TOON format](https://github.com/toon-format/toon) for AI-optimized output
