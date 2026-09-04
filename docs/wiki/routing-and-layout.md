# Routing and layout

The whole UI is one Quasar layout with two pages under it, plus a 404. There are no reusable components.

## Routes

`src/router/routes.js` defines them:

- `/` → `layouts/MainLayout.vue`, with children
  - `''` → `pages/PageHome.vue`, `name: 'Home'` (`:7-11`)
  - `/about` → `pages/PageAbout.vue`, `name: 'About'` (`:12-16`)
- `*` → `pages/Error404.vue` (`:22-25`)

Every route is a dynamic `import()`, so each page is its own chunk. Route **names** are load-bearing: the header title renders `{{ $route.name }}` (`src/layouts/MainLayout.vue:9`), so renaming a route renames what the user sees.

`src/router/index.js` is the stock Quasar factory: `scrollBehavior` resets to the top, and `mode`/`base` come from `process.env.VUE_ROUTER_MODE` / `VUE_ROUTER_BASE` (`:19-27`). The mode is set once in `quasar.conf.js:45` as `'hash'`, which is what makes the same build work when loaded from a file in Electron and Cordova.

`src/App.vue` is just `<router-view />` inside `#q-app`.

## MainLayout

`src/layouts/MainLayout.vue` uses `view="lHr lpR fFf"` (`:2`) and contains four regions:

- **Header** (`:4-19`) — a hamburger button toggling `left`, and a title that shows the route name on `gt-sm` screens and a Font Awesome dove icon on `lt-md`.
- **Left drawer** (`:21-62`) — 283px, `show-if-above`, with `exact` links to Home and About.
- **Right drawer** (`:64-115`) — a search input and three "trends" items. Both are placeholders: the input has no `v-model` or handler, and the three items are identical Lorem ipsum. Nothing toggles `right`, so on `lt-lg` widths the drawer is simply unreachable. See [known-issues](./known-issues.md).
- **Page container** (`:117-121`) — `<router-view />` wrapped in `<keep-alive>`, so a page's `mounted()` runs once only. This is why the Firestore listener in `PageHome` survives navigation to About and back (see [firebase-and-the-qweets-collection](./firebase-and-the-qweets-collection.md)).

Component-local state is two booleans, `left` and `right` (`:128-133`).

## PageHome

`src/pages/PageHome.vue` is the feed and the only page with behaviour:

- a composer: `q-input` with `v-model="newQweetContent"`, `maxlength="280"`, `counter`, `autogrow` (`:6-20`), and a Qweet button disabled while the model is empty (`:23-32`);
- the feed inside a `q-scroll-area` filling the page (`:3`), a `q-list` of `q-item`s keyed by document id (`:48-52`);
- a `transition-group` using `animated fadeIn slow` / `fadeOut slow` (`:43-47`); those two animations are the only ones enabled, in `quasar.conf.js:99`;
- per-qweet action row: reply, retweet, like, delete (`:69-98`). Only like and delete have handlers; reply and retweet are inert buttons.
- relative timestamps via a Vue 2 filter, `relativeDate`, wrapping `formatDistance` from date-fns (`:64`, `:168-172`). Because it is `formatDistance(value, new Date())` rather than `formatDistanceToNow` with `addSuffix`, the output has no "ago" — it renders as e.g. "5 minutes".

Styling is a scoped-by-convention `<style lang="sass">` block at the end of the file (`:198-213`) referencing the Sass variable `$grey-4`.

## The other pages

- `src/pages/PageAbout.vue` — a heading and two Lorem ipsum paragraphs.
- `src/pages/Error404.vue` — full-screen 404 with a "Go Home" button.

## Theme

`src/css/quasar.variables.sass:15` sets `$primary: #1da1f2` (Twitter's blue); the rest of the palette is Quasar's default. `src/css/app.sass` is empty apart from its comment. Icon sets loaded in `quasar.conf.js:30-41` are `fontawesome-v5`, `material-icons` and `roboto-font`; both icon sets are used in the markup (`fas fa-dove`, `far fa-heart` alongside `menu`, `home`, `help`, `search`).

See also [overview](./overview.md), [coding-standards](./coding-standards.md).

---

<sub>Wiki page `routing-and-layout` · revision 1 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
