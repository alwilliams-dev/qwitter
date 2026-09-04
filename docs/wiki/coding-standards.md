# Coding Standards

There is no `CONTRIBUTING.md`, no `AGENTS.md`/`CLAUDE.md`, no linter and no formatter configuration in this repository (no `.eslintrc*`, no eslint or prettier in `package.json`). So everything below is **observed from the code as written**, not a rule anyone recorded. Where the code is inconsistent, that is said rather than smoothed over.

The cross-project baseline is [engineering-principles](./engineering-principles.md); this page wins where they disagree.

## Whitespace and files

`.editorconfig` is the only machine-readable style rule: UTF-8, spaces, `indent_size = 2`, LF endings, final newline, trim trailing whitespace. Nothing enforces it in a build step, and trailing whitespace does survive in places (e.g. `src/router/routes.js:12`).

## JavaScript

- **Vue 2 Options API** throughout — `data()`, `methods`, `filters`, `mounted()`. No composition API, no `<script setup>`, no TypeScript (`supportTS: false`, `quasar.conf.js:12`).
- Every component sets `name` (`src/pages/PageHome.vue:113`, `src/pages/PageAbout.vue:13`, `src/pages/Error404.vue:27`) — except `MainLayout.vue`, which does not.
- **No semicolons** as the norm; two lines in `deleteQweet` have them (`src/pages/PageHome.vue:150`, `:152`).
- **Single quotes** in component scripts; `src/boot/firebase.js:1-2` uses double quotes.
- `let` is used where `const` would do (`src/boot/firebase.js:10`, `src/pages/PageHome.vue:135`, `:176`).
- **Promises, never async/await.** Firestore calls use `.then(...).catch(...)`, with `function () {}` callbacks in the methods (`src/pages/PageHome.vue:141-165`) and arrow functions in the snapshot handler where `this` is needed (`:174-193`).
- `console.log` on success paths and `console.error` on failure is the actual error-handling convention. Nothing is surfaced to the user.

## Vue templates

- One attribute per line once an element has more than two, ordered: handlers and bindings first (`@click`, `:disable`, `:color`), then string attributes, then boolean flags last (`rounded`, `unelevated`, `no-caps`) — `src/pages/PageHome.vue:23-32`, `:69-98`.
- Quasar components and utility classes do the layout and spacing work (`q-py-lg q-px-md row items-end q-col-gutter-md`, `text-body1`, `gt-sm` / `lt-md` visibility classes). Custom CSS is reserved for what utilities cannot express.
- Custom classes are semantic hooks on Quasar components (`new-qweet`, `qweet`, `qweet-content`, `qweet-icons`, `divider`, `header-icon`) and are styled in the same file.

## Styles

- **Indented Sass, not SCSS**, everywhere: `src/css/app.sass`, `src/css/quasar.variables.sass`, and in-component `<style lang="sass">`.
- Style blocks sit at the end of the `.vue` file and are **not** `scoped` (`src/pages/PageHome.vue:198`, `src/layouts/MainLayout.vue:137`); they rely on the custom class names for isolation, and they reference Quasar Sass variables directly (`$grey-4`).
- Palette overrides live only in `src/css/quasar.variables.sass`.

## Naming and where a new file goes

- Pages in `src/pages/`, PascalCase and prefixed `Page` — `PageHome.vue`, `PageAbout.vue`. `Error404.vue` is the exception.
- Layouts in `src/layouts/`, suffixed `Layout` — `MainLayout.vue`.
- Boot files in `src/boot/`, lowercase, and must be listed in `quasar.conf.js` `boot` to run (`quasar.conf.js:20-22`).
- `src/components/` does not exist yet; `jsconfig.json:11-13` already aliases `components/*` to it, so that is where a component would go.
- Imports use the Quasar/webpack aliases rather than relative paths: `layouts/MainLayout.vue`, `pages/PageHome.vue` (`src/router/routes.js:5-14`), `src/boot/firebase` (`src/pages/PageHome.vue:109`). The full alias list is in `jsconfig.json:4-29`.

## Tests

None exist. `package.json:9` is `"test": "echo \"No test specified\" && exit 0"` — deliberately exiting 0, so it passes vacuously. There is no test runner in the dependency tree and no CI to run one.

## Reviews

**Unknown.** No `CONTRIBUTING.md`, no PR template, no `.github/` directory, and the three commits in the reachable history are all direct pushes by the author. Nothing in the repository states what a reviewer looks for.

## Commit messages

Too small a sample to call a convention: the reachable history is `Initial commit`, `Finished app`, and `Updated README.md > "iOS Version (Cordova)" instructions` — short, imperative-ish, subject line only.

See also [architecture-decisions](./architecture-decisions.md) for the choices that constrain the code, and [known-issues](./known-issues.md) for where the code is knowingly unfinished.

---

<sub>Wiki page `coding-standards` · revision 2 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
