# Build targets

One codebase in `src/` is built for four targets by the Quasar CLI. `quasar.conf.js` holds the configuration for all of them; `README.md:11-100` holds the commands.

The CLI is expected to be installed globally — there is no `quasar` in `devDependencies` and no `dev`/`build` script in `package.json:8-10`. Dependencies install with `npm install` (`README.md:11-14`).

## Web (SPA)

```bash
quasar dev      # dev server
quasar build    # production build into dist/
```

Dev server: `https: false`, port `8080`, opens a browser automatically (`quasar.conf.js:69-73`). Router mode is `hash` (`:45`). `browserslist` in `package.json:26-36` targets a wide range of recent browser versions; PostCSS autoprefixes against it (`.postcssrc.js:6`).

## PWA

A `pwa` block exists with a full manifest — name "Qwitter", `standalone`, `portrait`, `theme_color: '#027be3'`, and five icon sizes (`quasar.conf.js:107-146`), with `workboxPluginMode: 'GenerateSW'`. The description is still the scaffold's "A Quasar Framework app". Nothing in the README documents building the PWA target, so whether it is intended to be shipped is unknown; the block is the Quasar default plus the app name.

## Desktop (Electron)

```bash
quasar dev -m electron
quasar build -m electron
```

- Bundler is `packager` (`quasar.conf.js:160`); the `packager.platform` option is commented out, and `README.md:35-39` says to set it to `win32`, `darwin`, `mas` or `linux` to cross-build.
- `nodeIntegration: true` (`quasar.conf.js:185`), which the main process passes into `webPreferences` via `process.env.QUASAR_NODE_INTEGRATION` (`src-electron/main-process/electron-main.js:31-32`).
- Main window: 1024×600, `minWidth` 1024, loads `process.env.APP_URL` (`src-electron/main-process/electron-main.js:23-39`). Standard `window-all-closed` / `activate` lifecycle for macOS (`:46-58`).
- `electron-main.dev.js` installs `electron-debug` and the Vue devtools extension, then imports the real main file (`src-electron/main-process/electron-main.dev.js:8-41`).
- Dev-only deps for this target: `electron ^9.4.1`, `electron-debug`, `electron-devtools-installer`, `electron-packager ^14.2.1`, `devtron` (`package.json:19-25`).
- `electron.builder.appId` is set to `qwitter` (`quasar.conf.js:181`) even though the bundler is `packager`.

## Mobile (Cordova)

```bash
npm install -g cordova
quasar dev   -m cordova -T ios       # or -T android
quasar build -m cordova -T ios
```

- App id `com.dannyconnell.qwitter`, name "Qwitter", version `0.0.1` (`src-cordova/config.xml:2-3`). `<access origin="*" />` and the usual `allow-intent` list; iOS sets `ScrollEnabled: true` (`:22`).
- Platforms declared: `ios`, `android`, with `cordova-android ^9.0.0` and `cordova-ios ^6.1.1`; plugins `cordova-plugin-whitelist` and `cordova-plugin-ionic-webview` (`src-cordova/package.json:15-30`).
- iOS needs Xcode; the README shows how to list simulators (`cd src-cordova && cordova run ios --list`) and target one with `-e "iPhone-12, 14.3"` (`README.md:52-67`).
- Android setup is delegated to the Quasar docs; the README notes launching an AVD from Android Studio first (`README.md:85-95`).
- `src-cordova/{platforms,plugins,www,node_modules}` are gitignored (`.gitignore:9-13`), so the native projects are generated, not tracked.

A `capacitor` block also exists in `quasar.conf.js:154-156` (`hideSplashscreen: true`), but there is no `src-capacitor/` directory — only gitignore entries for one (`.gitignore:15-17`). It is scaffold, not a supported target.

## What is not here

No CI configuration (`.github/` is absent), no Dockerfile, no deployment or hosting configuration (no `firebase.json`), and no release process of any kind. How, or whether, this app was ever deployed is not recorded in the repository.

See also [overview](./overview.md), [known-issues](./known-issues.md).

---

<sub>Wiki page `build-targets` · revision 1 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
