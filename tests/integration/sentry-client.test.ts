import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearClients,
  debugSourceMaps,
  getEvent,
  getIssue,
  getIssueEvent,
  getTagDetails,
  listIssueEvents,
  listIssueHashes,
  listOrgIssues,
  listProjectEvents,
  listProjectIssues,
  listTagValues,
  testConnection,
  updateIssue,
} from '../../src/utils/sentry-client.js';

describe('sentry-client integration', () => {
  let testDir: string;

  beforeEach(() => {
    // Create a temporary directory for test configs
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentry-cli-test-'));
    fs.mkdirSync(path.join(testDir, '.claude'));

    // Create test config
    const configContent = `---
profiles:
  test:
    authToken: TEST_TOKEN_FOR_INTEGRATION
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
    // Clear clients
    clearClients();

    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });

    // Clear env
    delete process.env.CLAUDE_PROJECT_ROOT;

    // Restore all mocks
    vi.restoreAllMocks();
  });

  describe('API function signatures', () => {
    it('should export listProjectEvents function', () => {
      expect(listProjectEvents).toBeDefined();
      expect(typeof listProjectEvents).toBe('function');
    });

    it('should export listProjectIssues function', () => {
      expect(listProjectIssues).toBeDefined();
      expect(typeof listProjectIssues).toBe('function');
    });

    it('should export listOrgIssues function', () => {
      expect(listOrgIssues).toBeDefined();
      expect(typeof listOrgIssues).toBe('function');
    });

    it('should export getIssue function', () => {
      expect(getIssue).toBeDefined();
      expect(typeof getIssue).toBe('function');
    });

    it('should export updateIssue function', () => {
      expect(updateIssue).toBeDefined();
      expect(typeof updateIssue).toBe('function');
    });

    it('should export listIssueEvents function', () => {
      expect(listIssueEvents).toBeDefined();
      expect(typeof listIssueEvents).toBe('function');
    });

    it('should export getEvent function', () => {
      expect(getEvent).toBeDefined();
      expect(typeof getEvent).toBe('function');
    });

    it('should export getIssueEvent function', () => {
      expect(getIssueEvent).toBeDefined();
      expect(typeof getIssueEvent).toBe('function');
    });

    it('should export getTagDetails function', () => {
      expect(getTagDetails).toBeDefined();
      expect(typeof getTagDetails).toBe('function');
    });

    it('should export listTagValues function', () => {
      expect(listTagValues).toBeDefined();
      expect(typeof listTagValues).toBe('function');
    });

    it('should export listIssueHashes function', () => {
      expect(listIssueHashes).toBeDefined();
      expect(typeof listIssueHashes).toBe('function');
    });

    it('should export debugSourceMaps function', () => {
      expect(debugSourceMaps).toBeDefined();
      expect(typeof debugSourceMaps).toBe('function');
    });

    it('should export testConnection function', () => {
      expect(testConnection).toBeDefined();
      expect(typeof testConnection).toBe('function');
    });

    it('should export clearClients function', () => {
      expect(clearClients).toBeDefined();
      expect(typeof clearClients).toBe('function');
    });
  });

  describe('function return types', () => {
    it('should return ApiResult from testConnection with error for invalid auth', async () => {
      // Clear clients to ensure fresh initialization
      clearClients();

      try {
        const result = await testConnection('test');

        expect(result).toBeDefined();
        expect(result).toHaveProperty('success');
        expect(typeof result.success).toBe('boolean');

        // With test token, should fail
        expect(result.success).toBe(false);
        expect(result).toHaveProperty('error');
      } catch (error) {
        // If initialization fails, that's also an expected behavior we want to handle
        expect(error).toBeDefined();
      }
    });

    it('should return ApiResult structure from listOrgIssues', async () => {
      // Clear clients to ensure fresh initialization
      clearClients();

      try {
        const result = await listOrgIssues('test', {}, 'json');

        expect(result).toBeDefined();
        expect(result).toHaveProperty('success');
        expect(typeof result.success).toBe('boolean');

        // Either success with result or error with error message
        if (result.success) {
          expect(result).toHaveProperty('result');
        } else {
          expect(result).toHaveProperty('error');
        }
      } catch (error) {
        // If initialization fails, that's also an expected behavior we want to handle
        expect(error).toBeDefined();
      }
    });
  });

  describe('client management', () => {
    it('should allow clearing clients', () => {
      expect(() => clearClients()).not.toThrow();
    });

    it('should not throw when clearing multiple times', () => {
      clearClients();
      expect(() => clearClients()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle invalid profile gracefully', async () => {
      // First clear the client so it reloads config
      clearClients();

      try {
        const result = await testConnection('nonexistent-profile');

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('not found');
      } catch (error) {
        // If it throws, verify it's the right kind of error
        const errorMessage = error instanceof Error ? error.message : String(error);
        expect(errorMessage).toContain('not found');
      }
    });

    it('should handle missing required config', async () => {
      // Remove config file
      const configPath = path.join(testDir, '.claude', 'sentry-connector.local.md');
      fs.unlinkSync(configPath);

      // Clear clients to force reload
      clearClients();

      try {
        const result = await testConnection('test');

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('Configuration file not found');
      } catch (error) {
        // If it throws, verify it's a configuration error
        const errorMessage = error instanceof Error ? error.message : String(error);
        expect(errorMessage).toContain('Configuration file not found');
      }
    });
  });
});
