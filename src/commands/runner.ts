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
  loadConfig,
  testConnection,
  updateIssue,
} from '../utils/index.js';

/**
 * Execute a Sentry API command in headless mode
 * @param command - The command name to execute
 * @param arg - JSON string or null for the command arguments
 */
export const runCommand = async (
  command: string,
  arg: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _flag: string | null
): Promise<void> => {
  try {
    // Load config to get default profile
    const projectRoot = process.env.CLAUDE_PROJECT_ROOT || process.cwd();
    const config = loadConfig(projectRoot);

    // Parse arguments
    const args = arg && arg.trim() !== '' ? JSON.parse(arg) : {};
    const profile = args.profile || config.defaultProfile;
    const format = args.format || config.defaultFormat;

    // Filter out CLI-specific parameters that shouldn't be sent to Sentry API
    const filterCliParams = (params: Record<string, unknown>): Record<string, unknown> => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        profile: _profile,
        format: _format,
        projectSlug: _projectSlug,
        issueId: _issueId,
        eventId: _eventId,
        tagKey: _tagKey,
        ...apiParams
      } = params;
      /* eslint-enable @typescript-eslint/no-unused-vars */
      return apiParams;
    };

    let result;

    switch (command) {
      case 'list-project-events':
        if (!args.projectSlug) {
          console.error('ERROR: "projectSlug" parameter is required');
          process.exit(1);
        }
        result = await listProjectEvents(profile, args.projectSlug, filterCliParams(args), format);
        break;

      case 'list-project-issues':
        if (!args.projectSlug) {
          console.error('ERROR: "projectSlug" parameter is required');
          process.exit(1);
        }
        result = await listProjectIssues(profile, args.projectSlug, filterCliParams(args), format);
        break;

      case 'list-org-issues':
        result = await listOrgIssues(profile, filterCliParams(args), format);
        break;

      case 'get-issue':
        if (!args.issueId) {
          console.error('ERROR: "issueId" parameter is required');
          process.exit(1);
        }
        result = await getIssue(profile, args.issueId, format);
        break;

      case 'update-issue':
        if (!args.issueId) {
          console.error('ERROR: "issueId" parameter is required');
          process.exit(1);
        }
        result = await updateIssue(profile, args.issueId, filterCliParams(args));
        break;

      case 'list-issue-events':
        if (!args.issueId) {
          console.error('ERROR: "issueId" parameter is required');
          process.exit(1);
        }
        result = await listIssueEvents(profile, args.issueId, filterCliParams(args), format);
        break;

      case 'get-event':
        if (!args.projectSlug || !args.eventId) {
          console.error('ERROR: "projectSlug" and "eventId" parameters are required');
          process.exit(1);
        }
        result = await getEvent(profile, args.projectSlug, args.eventId, format);
        break;

      case 'get-issue-event':
        if (!args.issueId || !args.eventId) {
          console.error('ERROR: "issueId" and "eventId" parameters are required');
          process.exit(1);
        }
        result = await getIssueEvent(profile, args.issueId, args.eventId, format);
        break;

      case 'get-tag-details':
        if (!args.issueId || !args.tagKey) {
          console.error('ERROR: "issueId" and "tagKey" parameters are required');
          process.exit(1);
        }
        result = await getTagDetails(profile, args.issueId, args.tagKey, filterCliParams(args), format);
        break;

      case 'list-tag-values':
        if (!args.issueId || !args.tagKey) {
          console.error('ERROR: "issueId" and "tagKey" parameters are required');
          process.exit(1);
        }
        result = await listTagValues(profile, args.issueId, args.tagKey, filterCliParams(args), format);
        break;

      case 'list-issue-hashes':
        if (!args.issueId) {
          console.error('ERROR: "issueId" parameter is required');
          process.exit(1);
        }
        result = await listIssueHashes(profile, args.issueId, format);
        break;

      case 'debug-source-maps':
        if (!args.projectSlug || !args.eventId) {
          console.error('ERROR: "projectSlug" and "eventId" parameters are required');
          process.exit(1);
        }
        result = await debugSourceMaps(profile, args.projectSlug, args.eventId, filterCliParams(args), format);
        break;

      case 'test-connection':
        result = await testConnection(profile);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    // Display result
    if (result.success) {
      console.log(result.result);
    } else {
      console.error(result.error);
      process.exit(1);
    }

    // Clear clients
    clearClients();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error executing command:', errorMessage);
    clearClients();
    process.exit(1);
  }
};
