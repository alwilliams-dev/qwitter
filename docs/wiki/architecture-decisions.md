# Architecture Decisions

**Read this caveat first.** Nothing in this repository explains *why* any of the following was chosen. There is no ADR directory, no design document, and the reachable git history is three commits with the messages `Initial commit`, `Finished app` and a README tweak. The README documents *how* to set the project up, never the reasoning. So each entry below records **what the code does** and marks the rationale as unrecorded — filling those in is a job for someone who knows the history.

Several of these are simply what `quasar create` scaffolds and were evidently left alone; they are listed anyway, because a reader would otherwise assume they were deliberate.

## One Quasar codebase for web, desktop and mobile

`src/` is built unchanged for SPA, Electron and Cordova; per-target settings all live in `quasar.conf.js`, and the native shells are thin (`src-electron/main-process/`, `src-cordova/config.xml`). `README.md:1-3` states the cross-platform goal as the point of the project. Details in [build-targets](./build-targets.md).

*Alternatives and rationale: unrecorded.* Consequence worth knowing: `vueRouterMode: 'hash'` (`quasar.conf.js:45`) is the setting that lets the same bundle work when loaded from a local file in Electron and Cordova, so switching to `history` mode for prettier web URLs would need per-target handling.

## Firestore is called directly from the client; there is no backend

`src/boot/firebase.js` creates the Firestore handle and exports it; `src/pages/PageHome.vue:134-194` performs every read and write inline in component methods. There is no service, repository or API layer, and no server code anywhere in the repository. See [firebase-and-the-qweets-collection](./firebase-and-the-qweets-collection.md).

*Rationale: unrecorded.* The cost is visible: the security model is entirely Firestore rules, and this repository contains none — the README instead says to start the database in test mode (`README.md:9`). See [known-issues](./known-issues.md).

## The Firestore listener is the only state store

Quasar's scaffold offers Vuex; `src/store/` does not exist and Vuex is not a dependency (`package.json:11-17`). Feed state is a component-local array in `PageHome`, reconciled by `snapshot.docChanges()` (`src/pages/PageHome.vue:174-193`). Mutations do not touch local state at all — they write to Firestore and wait for the listener to echo back.

*Rationale: unrecorded.* It works because there is exactly one consumer of the data. A second page needing qweets would have to attach its own listener.

## `<keep-alive>` around the router view

`src/layouts/MainLayout.vue:118-120` wraps `<router-view />` in `<keep-alive>`, so page components are cached and `mounted()` runs once. This is what keeps the Firestore subscription alive across navigation — and also what makes the missing unsubscribe harmless in practice.

*Rationale: unrecorded* (no comment on the element).

## Timestamps are client-side epoch milliseconds

`date: Date.now()` (`src/pages/PageHome.vue:137`) rather than a Firestore `Timestamp` or `serverTimestamp()`, and ordering uses `orderBy('date')` on that number (`:174`). Rendering goes through a date-fns `formatDistance` filter (`:168-172`).

*Rationale: unrecorded.* It means ordering depends on each client's clock.

## The Quasar CLI is a global tool, not a dev dependency

`README.md:16-100` drives everything with bare `quasar dev` / `quasar build`; `package.json` has no `dev` or `build` script and no `quasar-cli`/`@quasar/cli` dependency, only `@quasar/app` (`package.json:19`). Contributors must install the CLI themselves.

*Rationale: unrecorded.* This was the usual Quasar v1 workflow at the time.

## Electron: `packager` bundler, node integration on

`bundler: 'packager'` with `nodeIntegration: true` (`quasar.conf.js:160`, `:185`), consumed by `src-electron/main-process/electron-main.js:31-32`. The `builder` block is also present and sets `appId: 'qwitter'` (`quasar.conf.js:181`) despite not being the selected bundler, and `packager.platform` is commented out so the target platform is chosen by editing the file (`README.md:35-39`).

*Rationale: unrecorded.* Both values are Quasar's scaffold defaults for v1.

## No linting, no tests, no CI

Deliberate or not, this is the state: no lint configuration, `test` is a no-op that exits 0 (`package.json:9`), and there is no `.github/` directory. Recorded here because a reader would otherwise look for the pipeline. See [coding-standards](./coding-standards.md).

## Capacitor is configured but absent

`quasar.conf.js:154-156` carries a `capacitor` block and `.gitignore:15-17` ignores `src-capacitor/`, but the directory does not exist. Scaffold residue rather than a decision.

See also [overview](./overview.md), [known-issues](./known-issues.md).

---

<sub>Wiki page `architecture-decisions` · revision 2 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
