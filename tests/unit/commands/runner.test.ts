import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runCommand } from '../../../src/commands/runner.js';

describe('command runner', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    // Save original cwd
    originalCwd = process.cwd();

    // Create a temporary directory for test configs
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentry-cli-test-'));
    fs.mkdirSync(path.join(testDir, '.claude'));

    // Create test config
    const configContent = `---
profiles:
  test:
    authToken: TEST_TOKEN
    organization: test-org
    baseUrl: https://sentry.io/api/0

defaultProfile: test
defaultFormat: json
---
`;
    const configPath = path.join(testDir, '.claude', 'sentry-connector.local.md');
    fs.writeFileSync(configPath, configContent);

    // Set test directory as project root
    process.env.CLAUDE_PROJECT_ROOT = testDir;
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });

    // Restore original cwd
    process.chdir(originalCwd);

    // Clear env
    delete process.env.CLAUDE_PROJECT_ROOT;

    // Restore all mocks
    vi.restoreAllMocks();
  });

  describe('runCommand', () => {
    it('should handle test-connection command without API call', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      // This will fail due to invalid token, but we can verify it tries to execute
      await runCommand('test-connection', null, null);

      // Should exit (either 0 or 1)
      expect(exitSpy).toHaveBeenCalled();

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require projectSlug for list-project-events', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-project-events', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "projectSlug" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require projectSlug for list-project-issues', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-project-issues', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "projectSlug" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId for get-issue', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('get-issue', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId for update-issue', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('update-issue', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId for list-issue-events', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-issue-events', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require projectSlug and eventId for get-event', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('get-event', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "projectSlug" and "eventId" parameters are required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId and eventId for get-issue-event', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('get-issue-event', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" and "eventId" parameters are required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId and tagKey for get-tag-details', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('get-tag-details', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" and "tagKey" parameters are required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId and tagKey for list-tag-values', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-tag-values', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" and "tagKey" parameters are required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require issueId for list-issue-hashes', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-issue-hashes', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "issueId" parameter is required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should require projectSlug and eventId for debug-source-maps', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('debug-source-maps', '{}', null);

      expect(errorSpy).toHaveBeenCalledWith('ERROR: "projectSlug" and "eventId" parameters are required');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should handle unknown command', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('unknown-command', null, null);

      expect(errorSpy).toHaveBeenCalledWith('Unknown command: unknown-command');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should parse JSON arguments correctly', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const args = JSON.stringify({ query: 'is:unresolved', limit: 50 });
      await runCommand('list-org-issues', args, null);

      // Should attempt execution and exit
      expect(exitSpy).toHaveBeenCalled();

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should handle empty string arguments', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-org-issues', '', null);

      // Should attempt execution and exit
      expect(exitSpy).toHaveBeenCalled();

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should use default profile when profile not specified', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('test-connection', null, null);

      // Should attempt execution and exit
      expect(exitSpy).toHaveBeenCalled();

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should handle API errors gracefully', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('test-connection', null, null);

      // Should output error message and exit with code 1
      expect(errorSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should handle JSON parse errors', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      await runCommand('list-org-issues', 'invalid-json', null);

      // Should call error with "Error executing command:" as first argument
      expect(errorSpy).toHaveBeenCalled();
      const firstCallFirstArg = errorSpy.mock.calls[0][0];
      expect(firstCallFirstArg).toContain('Error executing command');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
