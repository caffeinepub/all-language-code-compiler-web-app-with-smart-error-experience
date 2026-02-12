# Specification

## Summary
**Goal:** Build a web-based multi-language code compile/run app with a “smart error experience” that turns stderr into actionable, line-aware diagnostics.

**Planned changes:**
- Create a frontend page with a language dropdown, code editor area, optional stdin/flags inputs, and a primary “Compile & Run” action.
- Display normalized results including stdout, stderr, exit status, and timing in a clear layout with separate stdout/stderr sections.
- Implement frontend error parsing to extract structured diagnostics (message, severity, best-effort line/column), show an error/warning list, and render a code-frame snippet highlighting the referenced line.
- Add a backend API (single Motoko actor) to accept compile/run requests, enforce request size limits, and return a consistent normalized result/error format.
- Integrate backend with an external compile/execute REST provider using server-side configuration for base URL and credentials; support at least one language end-to-end via a mapping/config approach.
- Use React Query for compile/run calls with in-flight disabling/cancellation behavior and user-visible network/provider failure states with retry.
- Apply a consistent visual theme (avoiding blue/purple as the primary palette) across editor, controls, and results panels.
- Add and reference generated static branding images from `frontend/public/assets/generated`, with at least one visible in the UI.

**User-visible outcome:** Users can write code, choose a language, compile/run it, and view stdout/stderr plus status/timing; when errors occur, they get a selectable diagnostics list with an inline highlighted code-frame preview, along with clear network/provider error handling.
