# Overview

Qwitter is a small Twitter-like single-page app: one feed of short posts ("qweets") that can be created, liked and deleted, backed by Cloud Firestore. `README.md:1-3` describes it as "A Cross-Platform Twitter Clone created with Quasar Framework, VueJS & Firebase", and the same source is packaged for the browser, for desktop via Electron, and for iOS/Android via Cordova — see [build-targets](./build-targets.md).

It is a complete-but-small app, not a product: the whole client is four `.vue` files and one boot file.

## The three things to know first

1. **There is no backend of our own and no server code.** The browser talks to Firestore directly through the Firebase JS SDK. All reads, writes and deletes happen in `src/pages/PageHome.vue:134-194`. See [firebase-and-the-qweets-collection](./firebase-and-the-qweets-collection.md).
2. **There are no users.** No authentication is configured, and the author's name, handle and Gravatar image are hard-coded into the markup (`src/pages/PageHome.vue:17`, `:55`, `:61-63`). Every qweet renders as if posted by the same person. See [known-issues](./known-issues.md).
3. **It will not run as checked out.** `src/boot/firebase.js:4-6` holds an empty `firebaseConfig` with a `// YOUR CONFIG HERE` comment; `README.md:5-9` tells you to create a Firebase project and paste the config in. Until you do, `firebase.initializeApp` gets an empty object.

## Layout of the repository

| Path | What is in it |
| --- | --- |
| `src/` | the app: `boot/`, `css/`, `layouts/`, `pages/`, `router/`, `assets/`, `App.vue`, `index.template.html` |
| `src-electron/` | Electron main process (`main-process/electron-main.js`, `electron-main.dev.js`) and app icons |
| `src-cordova/` | Cordova project: `config.xml`, its own `package.json` with the iOS/Android platforms |
| `public/` | `favicon.ico` and PWA/web icons |
| `quasar.conf.js` | the single build/runtime configuration for every target |

`src/components/` does not exist, although `jsconfig.json:11-13` defines a `components/*` alias for it. Everything is either a page or the one layout — see [routing-and-layout](./routing-and-layout.md).

## Toolchain

- Quasar `^1.0.0` with Vue 2 (`package.json:12-16`); the CLI is `@quasar/app ^2.0.0` (`package.json:19`).
- The `quasar` CLI is invoked directly (`quasar dev`, `quasar build` in `README.md:16-100`); it is **not** wired into `package.json` scripts. The only script is `test`, which echoes "No test specified" (`package.json:9`).
- Node `>= 10.18.1`, npm `>= 6.13.4` (`package.json:37-41`).
- Babel via `@quasar/babel-preset-app` (`babel.config.js:3-5`); PostCSS with autoprefixer (`.postcssrc.js:6`); Sass for styles.
- Dependencies beyond Quasar: `firebase ^8.2.4` and `date-fns ^2.16.1` (`package.json:14-15`).

## Provenance

MIT licensed, "Copyright (c) 2021 Danny Connell" (`LICENSE:3`), who is also the `author` in `package.json:6`. The git history reachable here is three commits, all from 2021-01-27, ending with `af8c278` and `dd23a1e "Finished app"`. The relationship between that author and the current remote (`alwilliams-dev/qwitter`) is not recorded anywhere in the repository.

## Where to go next

- [firebase-and-the-qweets-collection](./firebase-and-the-qweets-collection.md) — the data model and the realtime listener
- [routing-and-layout](./routing-and-layout.md) — routes, the single layout, the pages
- [build-targets](./build-targets.md) — web, Electron, Cordova and what each needs
- [coding-standards](./coding-standards.md) — the conventions the code actually follows
- [architecture-decisions](./architecture-decisions.md) — the choices visible in the code, and what is *not* explained
- [known-issues](./known-issues.md) — unfinished UI, placeholder content, security posture

See [wiki-conventions](./wiki-conventions.md) for how this wiki works, and [engineering-principles](./engineering-principles.md) for the cross-project baseline.

---

<sub>Wiki page `overview` · revision 2 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
