Added documentation explaining the `session-switch.mjs` integration test from the [different-ai/openwork](https://github.com/different-ai/openwork) repository, which validates session isolation and concurrent session management in OpenWork.

## Changes

- **SESSION_SWITCH_EXPLANATION.md** - Technical deep-dive covering:
  - Test architecture and flow (setup → session creation → message isolation → concurrent ops)
  - Component breakdown: server spawning, client creation, session management, assertion patterns
  - Helper utilities from `_util.mjs` (port allocation, health checks, server lifecycle)
  - CI/CD integration patterns and structured JSON output
  - Usage examples and failure scenarios

- **README.md** - Repository index documenting existing content and linking to new documentation

## Context

The test validates critical session isolation guarantees:
- Multiple sessions maintain independent message histories
- No cross-session data leakage
- Concurrent operations complete correctly
- Session IDs properly scope all operations

Example test pattern from the script:
```javascript
// Create two isolated sessions
sessionA = await client.session.create({ title: "OpenWork session A" });
sessionB = await client.session.create({ title: "OpenWork session B" });

// Send distinct messages
await client.session.prompt({ sessionID: sessionA.id, parts: [{ type: "text", text: "Hello from session A" }] });

// Verify isolation
const messages = await client.session.messages({ sessionID: sessionA.id });
assert.equal(getMessageSessionId(msg), sessionA.id); // No B messages leak into A
```

<!-- START COPILOT CODING AGENT SUFFIX -->



<!-- START COPILOT ORIGINAL PROMPT -->



<details>

<summary>Original prompt</summary>

> Explain this repo "different-ai/openwork/blob/dev/script/session-switch.mjs"


</details>
