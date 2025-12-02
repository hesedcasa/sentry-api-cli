import { describe, expect, it, vi } from 'vitest';

import { getCurrentVersion, printAvailableCommands, printCommandDetail } from '../../../src/commands/helpers.js';
import { COMMANDS, COMMANDS_INFO } from '../../../src/config/constants.js';

describe('command helpers', () => {
  describe('getCurrentVersion', () => {
    it('should return version string', () => {
      const version = getCurrentVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning format
    });
  });

  describe('printAvailableCommands', () => {
    it('should print all available commands', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printAvailableCommands();

      expect(logSpy).toHaveBeenCalled();
      // Verify it prints the header
      expect(logSpy.mock.calls[0][0]).toContain('Available');

      logSpy.mockRestore();
    });

    it('should print all 13 Sentry commands', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printAvailableCommands();

      // Should print header + 13 commands
      expect(logSpy).toHaveBeenCalledTimes(14);

      // Verify some key commands are included
      const allOutput = logSpy.mock.calls.map(call => call[0]).join('\n');
      expect(allOutput).toContain('list-project-events');
      expect(allOutput).toContain('list-project-issues');
      expect(allOutput).toContain('get-issue');
      expect(allOutput).toContain('test-connection');
      expect(allOutput).toContain('debug-source-maps');

      logSpy.mockRestore();
    });

    it('should match number of commands with descriptions', () => {
      expect(COMMANDS.length).toBe(COMMANDS_INFO.length);
    });
  });

  describe('printCommandDetail', () => {
    it('should print details for valid command', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printCommandDetail('test-connection');

      expect(logSpy).toHaveBeenCalled();
      const output = logSpy.mock.calls[0][0];
      expect(output).toContain('test-connection');
      expect(output).toContain('Test Sentry API connection');

      logSpy.mockRestore();
    });

    it('should print error for invalid command', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printCommandDetail('invalid-command');

      expect(logSpy).toHaveBeenCalled();
      const firstCall = logSpy.mock.calls[0][0];
      expect(firstCall).toContain('Unknown command');

      logSpy.mockRestore();
    });

    it('should print error for empty command', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printCommandDetail('');

      expect(logSpy).toHaveBeenCalled();
      const firstCall = logSpy.mock.calls[0][0];
      expect(firstCall).toContain('provide a command name');

      logSpy.mockRestore();
    });

    it('should print details for all valid commands', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      COMMANDS.forEach(cmd => {
        logSpy.mockClear();
        printCommandDetail(cmd);

        expect(logSpy).toHaveBeenCalled();
        const output = logSpy.mock.calls[0][0];
        expect(output).toContain(cmd);
      });

      logSpy.mockRestore();
    });

    it('should handle command with trimming', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printCommandDetail('  test-connection  ');

      expect(logSpy).toHaveBeenCalled();
      const output = logSpy.mock.calls[0][0];
      expect(output).toContain('test-connection');

      logSpy.mockRestore();
    });
  });

  describe('command consistency', () => {
    it('should have descriptions for all commands', () => {
      expect(COMMANDS.length).toBe(COMMANDS_INFO.length);

      COMMANDS.forEach((cmd, idx) => {
        expect(COMMANDS_INFO[idx]).toBeDefined();
        expect(COMMANDS_INFO[idx].length).toBeGreaterThan(0);
      });
    });

    it('should have all expected Sentry commands', () => {
      const expectedCommands = [
        'list-project-events',
        'list-project-issues',
        'list-org-issues',
        'get-issue',
        'update-issue',
        'list-issue-events',
        'get-event',
        'get-issue-event',
        'get-tag-details',
        'list-tag-values',
        'list-issue-hashes',
        'debug-source-maps',
        'test-connection',
      ];

      expectedCommands.forEach(cmd => {
        expect(COMMANDS).toContain(cmd);
      });

      expect(COMMANDS.length).toBe(expectedCommands.length);
    });
  });
});
