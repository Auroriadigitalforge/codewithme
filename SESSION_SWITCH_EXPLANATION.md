# Explanation of session-switch.mjs from different-ai/openwork

## Overview

The `session-switch.mjs` file from the [different-ai/openwork](https://github.com/different-ai/openwork) repository is an **automated integration test script** that validates the OpenWork application's ability to correctly manage and isolate multiple concurrent sessions.

## Repository Context: OpenWork

**OpenWork** is an extensible, open-source "Claude Work" style system for knowledge workers. It's a native desktop application that runs OpenCode under the hood, providing a clean, guided workflow for agentic work tasks.

## Purpose

This test script serves a critical quality assurance function by verifying that:

1. Multiple independent sessions can be created simultaneously
2. Each session maintains its own isolated message history
3. Messages sent to different sessions don't leak between sessions
4. The system can correctly retrieve and differentiate messages from different sessions
5. Concurrent session operations work correctly without race conditions

## How It Works

### Test Flow

The script follows a systematic testing approach:

```
1. Setup Phase
   ├── Find an available port
   ├── Spawn an OpenCode server instance
   └── Wait for the server to become healthy

2. Session Creation Phase
   ├── Create Session A with title "OpenWork session A"
   └── Create Session B with title "OpenWork session B"

3. Message Sending Phase
   ├── Send "Hello from session A" to Session A
   └── Send "Hello from session B" to Session B

4. Message Verification Phase
   ├── Retrieve messages from Session A
   ├── Verify all messages belong to Session A
   ├── Verify the text contains "session A"
   ├── Retrieve messages from Session B
   ├── Verify all messages belong to Session B
   └── Verify the text contains "session B"

5. Concurrent Operations Test
   ├── Simultaneously fetch messages from both sessions
   ├── Verify Session A messages contain "session A"
   └── Verify Session B messages contain "session B"

6. Cleanup Phase
   └── Close the OpenCode server
```

### Key Components

#### 1. Server Management
```javascript
const port = await findFreePort();
const server = await spawnOpencodeServe({ directory, port });
```
- Dynamically finds an available port to avoid conflicts
- Spawns a local OpenCode server instance for testing
- Uses the `@opencode-ai/sdk` client library to interact with the server

#### 2. Client Creation
```javascript
const client = makeClient({ baseUrl: server.baseUrl, directory: server.cwd });
await waitForHealthy(client);
```
- Creates an OpenCode client configured to connect to the test server
- Waits for the server to report healthy status before proceeding
- Uses response style "data" and throws errors for easy debugging

#### 3. Session Management
```javascript
sessionA = await client.session.create({ title: "OpenWork session A" });
sessionB = await client.session.create({ title: "OpenWork session B" });
```
- Creates two independent sessions with descriptive titles
- Each session gets a unique ID for isolation

#### 4. Message Operations
```javascript
await client.session.prompt({
  sessionID: sessionA.id,
  noReply: true,
  parts: [{ type: "text", text: "Hello from session A" }],
});
```
- Sends prompts to specific sessions using their unique IDs
- Uses `noReply: true` to avoid waiting for AI responses (faster testing)
- Messages are structured with a parts array for multi-modal support

#### 5. Assertion Logic

The script includes several helper functions for validation:

**`getMessageSessionId(message)`**
- Extracts the session ID from a message object
- Handles different message formats (direct sessionID or nested in info)
- Returns null if no session ID is found

**`extractLastText(messages)`**
- Searches through a message array from end to beginning
- Finds the last text content in the message parts
- Used to verify that messages contain expected content

**Session Isolation Verification**
```javascript
for (const msg of messages) {
  const msgSessionId = getMessageSessionId(msg);
  assert.equal(msgSessionId, sessionA.id);
}
```
- Ensures every message retrieved from Session A has Session A's ID
- This proves that session isolation is working correctly

#### 6. Results Tracking
```javascript
const results = {
  ok: true,
  baseUrl: server.baseUrl,
  directory: server.cwd,
  steps: [],
};
```
- Maintains a structured results object tracking each test step
- Records success/failure status for each operation
- Captures errors with meaningful messages for debugging
- Outputs results as JSON for easy parsing by CI/CD systems

### Step Function Pattern

The test uses a `step()` function wrapper that:
- Provides consistent error handling across all test steps
- Records each step's name, status, and data
- Allows the test to continue even if early steps fail
- Makes test output clear and structured

```javascript
function step(name, fn) {
  results.steps.push({ name, status: "running" });
  const idx = results.steps.length - 1;

  return Promise.resolve()
    .then(fn)
    .then((data) => {
      results.steps[idx] = { name, status: "ok", data };
    })
    .catch((e) => {
      results.ok = false;
      results.steps[idx] = {
        name,
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      };
      throw e;
    });
}
```

## Usage

The script can be run in several ways:

### Via npm script (from openwork repository):
```bash
npm run test:session-switch
# or with pnpm
pnpm test:session-switch
```

### Standalone execution:
```bash
node scripts/session-switch.mjs
```

### With custom directory:
```bash
node scripts/session-switch.mjs --dir /path/to/workspace
```

### As part of E2E test suite:
```bash
npm run test:e2e
```
This runs multiple integration tests including session-switch, e2e, and fs-engine tests.

## Output

The script outputs a JSON object with test results:

### Success Example:
```json
{
  "ok": true,
  "baseUrl": "http://127.0.0.1:3000",
  "directory": "/path/to/workspace",
  "steps": [
    { "name": "session.create A", "status": "ok", "data": { "id": "session-123" } },
    { "name": "session.create B", "status": "ok", "data": { "id": "session-456" } },
    { "name": "session.prompt A", "status": "ok", "data": { "sessionID": "session-123" } },
    { "name": "session.prompt B", "status": "ok", "data": { "sessionID": "session-456" } },
    { "name": "session.messages A", "status": "ok", "data": { "count": 1 } },
    { "name": "session.messages B", "status": "ok", "data": { "count": 1 } },
    { "name": "session.messages switch", "status": "ok", "data": { "aCount": 1, "bCount": 1 } }
  ]
}
```

### Failure Example:
```json
{
  "ok": false,
  "baseUrl": "http://127.0.0.1:3000",
  "directory": "/path/to/workspace",
  "steps": [
    { "name": "session.create A", "status": "ok", "data": { "id": "session-123" } },
    { 
      "name": "session.create B", 
      "status": "error", 
      "error": "Failed to create session: Connection refused" 
    }
  ],
  "error": "Failed to create session: Connection refused",
  "stderr": "Error: ECONNREFUSED connect ECONNREFUSED 127.0.0.1:3000\n..."
}
```

## Dependencies

The script relies on several key dependencies:

### Node.js Built-ins:
- `node:assert/strict` - Strict assertion testing
- Other utilities from `_util.mjs`

### External Libraries:
- `@opencode-ai/sdk` (v1.1.19+) - Official OpenCode client SDK

### Utility Module (_util.mjs):
- `findFreePort()` - Finds an available network port
- `makeClient()` - Creates configured OpenCode client
- `parseArgs()` - Parses command-line arguments
- `spawnOpencodeServe()` - Spawns OpenCode server process
- `waitForHealthy()` - Polls health endpoint until ready

## Why This Test Matters

Session management is critical for multi-user and multi-context applications. This test ensures that:

1. **Data Integrity**: User data doesn't leak between sessions
2. **Concurrent Operations**: Multiple sessions can operate simultaneously without interference
3. **Session Isolation**: Each session maintains its own independent state
4. **API Correctness**: The session API works as documented
5. **Regression Prevention**: Changes don't break existing session functionality

This is especially important for OpenWork because it's designed to handle:
- Multiple concurrent workspaces
- Different projects and contexts
- Team collaboration scenarios
- Long-running sessions with extensive message histories

## Related Files

- **`scripts/_util.mjs`** - Shared utility functions for all test scripts
- **`package.json`** - Defines the npm scripts including `test:session-switch`
- Other test scripts in the `scripts/` directory:
  - `health.mjs` - Health check tests
  - `sessions.mjs` - General session tests
  - `events.mjs` - Event streaming tests
  - `todos.mjs` - Todo/plan management tests
  - `permissions.mjs` - Permission system tests
  - `fs-engine.mjs` - File system engine tests
  - `e2e.mjs` - End-to-end workflow tests

## Integration with CI/CD

The script is designed to be CI/CD friendly:
- Exit code 1 on failure, 0 on success
- JSON output for easy parsing
- Structured error reporting with stderr capture
- Automatic cleanup on exit
- No interactive prompts
- Configurable test directory

## Conclusion

The `session-switch.mjs` script is a well-designed integration test that validates one of OpenWork's core features: the ability to manage multiple independent sessions. It demonstrates best practices in:
- Automated testing
- Resource cleanup
- Error handling
- Structured output
- Test isolation

This ensures OpenWork maintains high quality and reliability as the codebase evolves.

---

**Document Generated**: January 20, 2026  
**Source Repository**: [different-ai/openwork](https://github.com/different-ai/openwork)  
**Script Location**: `scripts/session-switch.mjs` (dev branch)
