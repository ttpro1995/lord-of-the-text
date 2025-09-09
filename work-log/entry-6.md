# Entry 6

## Technical Debt Findings

### High Severity Items

- **README.md default content**
  - Location: README.md
  - Description: The README file contains the default Vite React template content instead of project-specific documentation for Lord of the Text.
  - Severity: High
  - Impact: Users and contributors cannot understand the project's purpose, features, or how to run it, hindering collaboration and adoption.

- **Offline progress bug**
  - Location: [`src/App.jsx:gameReducer()`](src/App.jsx:195-213)
  - Description: The offline progress logic dispatches multiple TICK actions sequentially for each offline second, which can cause performance issues if the offline duration is large (e.g., hundreds of seconds), potentially leading to UI freezes or browser unresponsiveness.
  - Severity: High
  - Impact: Poor user experience for players returning after long absences; potential browser crashes or unresponsive UI.

- **Insufficient initial resources**
  - Location: [`src/App.jsx:initialState`](src/App.jsx:8-15)
  - Description: Starting resources (timber:60, stone:60, iron:10, food:10, gold:10, knowledge:10) are insufficient to build early-tier buildings, requiring players to wait for resource production before any progress can be made.
  - Severity: High
  - Impact: First-time players experience long idle time without meaningful actions, leading to poor initial engagement.

- **Failing unit tests**
  - Location: [`tests/app.test.js`](tests/app.test.js)
  - Description: Tests expect incorrect behavior, such as timber increasing after TICK without base production logic, causing test failures and making the test suite unreliable.
  - Severity: High
  - Impact: Inability to verify code changes confidently, potentially introducing bugs undetected due to broken CI/CD.

- **Missing notification tests**
  - Location: tests/ directory, specifically no tests for building completion notifications in [`tests/milestone2.test.js`](tests/milestone2.test.js)
  - Description: No unit tests cover building completion notifications, leaving a gap in test coverage for user feedback systems.
  - Severity: High
  - Impact: Notification features are untested, increasing risk of bugs in the user feedback system.

### Medium Severity Items

- **Lack of user error messages**
  - Location: [`src/App.jsx:gameReducer()`](src/App.jsx:104-110, 134-137)
  - Description: When building actions fail due to missing dependencies or insufficient resources, only console.log statements are used with no in-game error messages shown to the user.
  - Severity: Medium
  - Impact: Users don't receive clear feedback on why actions fail, leading to confusion and frustration.

- **Hardcoded values**
  - Location: [`src/App.jsx:gameReducer()`](src/App.jsx:143, 40-41)
  - Description: Constants like unit costs, base unit cap, and cap per barracks level are hardcoded directly in the reducer code.
  - Severity: Medium
  - Impact: Difficult to balance gameplay; balance changes require code modifications instead of external configuration.

- **Monolithic reducer**
  - Location: [`src/App.jsx:gameReducer()`](src/App.jsx:43-186)
  - Description: All game logic (resource production, building, unit training, etc.) is handled in a single large reducer function, mixing multiple concerns.
  - Severity: Medium
  - Impact: Hard to maintain, debug, and test; violates single responsibility principle and makes the code harder to evolve.

- **Accumulating notifications**
  - Location: [`src/App.jsx:gameReducer()`](src/App.jsx:85)
  - Description: Notifications are handled inconsistently - new notifications replace old ones instead of properly accumulating, potentially losing messages if multiple events occur in sequence.
  - Severity: Medium
  - Impact: Users might miss important notifications like unit completions if they happen close together in time.

- **Missing production notifications**
  - Location: Not implemented in current codebase
  - Description: No notifications exist for resource production milestones or when resource caps are reached, despite these being critical user concerns.
  - Severity: Medium
  - Impact: Users are not informed of resource status changes, particularly when caps are hit during offline progress or regular play.

- **Unclear documentation**
  - Location: vibe-doc/ directory files and README.md
  - Description: Documentation is fragmented and lacks clarity on project architecture, component interactions, and core game mechanics.
  - Severity: Medium
  - Impact: Difficult for new contributors to onboard quickly; potential for misimplementations due to unclear requirements.

- **Lack of documentation index**
  - Location: No index file exists in vibe-doc/ directory
  - Description: No consolidated index or navigation guide to the various documentation files in the project.
  - Severity: Medium
  - Impact: Contributors are overwhelmed trying to locate relevant information without a clear entry point.

- **Missing integration tests**
  - Location: tests/ directory lacks integration-level tests
  - Description: Current test suite only includes unit tests; no integration tests for end-to-end flows like full building-upgrade-training cycles or UI component interactions.
  - Severity: Medium
  - Impact: Full application workflows are untested, increasing risk of integration bugs that unit tests miss.

- **Informal manual tests**
  - Location: [`tests/manual-test.js`](tests/manual-test.js)
  - Description: Manual test procedures are informal, unstructured, and not comprehensive for key features.
  - Severity: Medium
  - Impact: Inconsistent testing procedures that are hard to reproduce and may miss edge cases.

### Date
2025-09-09T12:51:13.499Z