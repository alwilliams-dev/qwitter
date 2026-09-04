# Known Issues

There is no issue tracker content, no TODO comment and no bug list in this repository. Everything below was read off the code in this clone — so treat "known" as "known to this wiki", not as something the author documented. Each entry says what you will hit and where it comes from.

## The app cannot start until you paste in a Firebase config

`src/boot/firebase.js:4-6` is `const firebaseConfig = { /* YOUR CONFIG HERE */ }`, an empty object handed to `firebase.initializeApp` at `:8`. A fresh clone therefore fails at boot. `README.md:5-9` is the fix: create a Firebase project and web app, paste the config into that file, and create a Firestore database. Because the file is tracked and not gitignored, doing so puts your Firebase web config into the repository — a `.gitignore` entry or a `.env`-based config would avoid that, and neither exists here.

## The Firestore database is expected to be in test mode

`README.md:9` says "make sure you choose 'Start in test mode'", which grants unrestricted read and write to the `qweets` collection. No `firestore.rules` or `firebase.json` is in the repository, so there is nothing to deploy a stricter rule set from. Anyone who obtains the web config can post, edit and delete anything. Fine for a demo; do not put this on the internet as-is. See [firebase-and-the-qweets-collection](./firebase-and-the-qweets-collection.md).

## Every qweet is attributed to the same hard-coded person

There is no authentication and no author field on the documents. The avatar URL, display name and handle are literals in the template: `src/pages/PageHome.vue:17`, `:55`, `:61-63`. Adding real users means adding an auth layer, an author field on the document, and rules that key off it.

## Failures are invisible to the user

All three Firestore mutations only `console.error` on rejection — `addNewQweet` (`src/pages/PageHome.vue:143-145`), `deleteQweet` (`:151-152`), `toggleLiked` (`:162-164`). The composer also clears `newQweetContent` synchronously at `:146`, before the write resolves, so a rejected write silently loses the text the user typed. Success paths log to the console too (`:142`, `:150`, `:160`, and `:179`/`:183`/`:188` in the listener), which means production builds are chatty.

## The snapshot listener is never unsubscribed

`db.collection('qweets').orderBy('date').onSnapshot(...)` at `src/pages/PageHome.vue:174` discards the returned unsubscribe function, and there is no `beforeDestroy`. Today this leaks nothing observable, because `<keep-alive>` in `src/layouts/MainLayout.vue:118-120` keeps the single instance alive for the life of the app. **Do not remove that `<keep-alive>` without adding an unsubscribe** — and if `PageHome` ever gets mounted twice, changes will be applied twice.

## Edited qweets do not re-sort

The query orders by `date` ascending and the `added` branch `unshift`es, producing newest-first (`src/pages/PageHome.vue:174-181`). The `modified` branch does `Object.assign` in place (`:182-186`), so if a document's `date` ever changed the list order would no longer match the query. Nothing currently updates `date`, so this is latent rather than broken.

## Relative dates read oddly

`relativeDate` calls `formatDistance(value, new Date())` (`src/pages/PageHome.vue:170`) with no `addSuffix`, so timestamps render as "5 minutes" rather than "5 minutes ago". `formatDistanceToNow(value, { addSuffix: true })` is the date-fns idiom for what the UI appears to want.

## Reply and retweet buttons do nothing

The comment and retweet buttons in the action row have no `@click` (`src/pages/PageHome.vue:69-82`) — they render and depress but are inert. Only like (`:83-90`) and delete (`:91-98`) are wired.

## The right drawer is placeholder content, and unreachable on small screens

`src/layouts/MainLayout.vue:64-115`: the search input has no `v-model` and no handler, and the three "trends" items are identical Lorem ipsum. The drawer is `show-if-above` with `right` defaulting to `false` (`:130-132`), and nothing in the header toggles `right` — so below the drawer's breakpoint there is no way to open it. The About page is Lorem ipsum too (`src/pages/PageAbout.vue:5-6`).

## 280 characters is enforced only in the browser

`maxlength="280"` on the composer input (`src/pages/PageHome.vue:10`) is the only length limit. With test-mode rules, any client can write a document of any size.

## Pinned to versions that are now well behind

`quasar ^1.0.0` (Vue 2), `firebase ^8.2.4` (the namespaced SDK, superseded by the modular v9 API), `electron ^9.4.1`, `cordova-android ^9`, `cordova-ios ^6.1.1`, `engines.node >= 10.18.1` — `package.json:11-25`, `:37-41`, `src-cordova/package.json:15-20`. Recent Node versions may not build this without trouble; whether it still builds on a current toolchain has **not** been verified here. Upgrading Firebase to v9+ or Quasar to v2 is a rewrite of `src/boot/firebase.js` and the Options-API/filters code in `PageHome`, not a version bump — Vue 3 removed filters, which `src/pages/PageHome.vue:168-172` relies on.

## Placeholder metadata left from the scaffold

`description` is "A Quasar Framework app" in `package.json:4`, `quasar.conf.js:113` and `src-cordova/config.xml:4`; the Cordova `author` is still "Apache Cordova Team" (`src-cordova/config.xml:5-7`, `src-cordova/package.json:13`); `src/assets/` still holds only `quasar-logo-full.svg`, which nothing imports. Harmless, but it surfaces in the PWA manifest and app store metadata.

See also [architecture-decisions](./architecture-decisions.md) for the ones that are deliberate, and [coding-standards](./coding-standards.md) for the rules a workaround might be breaking.

---

<sub>Wiki page `known-issues` · revision 2 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
