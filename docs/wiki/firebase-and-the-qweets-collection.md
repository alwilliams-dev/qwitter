# Firebase and the qweets collection

The app's entire persistence layer is one Firestore collection, reached directly from the browser. There is no API layer, no repository module and no store.

## Initialisation

`src/boot/firebase.js` is a Quasar boot file, registered as `boot: ['firebase']` in `quasar.conf.js:20-22`, so it runs as part of the generated `main.js` before the app mounts. It:

- imports the namespaced Firebase 8 API — `firebase/app` plus `firebase/firestore` only (`src/boot/firebase.js:1-2`); no auth, storage or functions;
- calls `firebase.initializeApp(firebaseConfig)` (`:8`);
- exports the Firestore instance as the module's default (`:10-12`).

`firebaseConfig` is an empty object with `// YOUR CONFIG HERE` (`:4-6`). `README.md:5-9` says to create a Firebase project and web app named Qwitter, paste the config into this file, and create a Firestore database **"Start in test mode"**.

Consumers import the db directly: `import db from 'src/boot/firebase'` (`src/pages/PageHome.vue:109`).

## The document shape

A qweet is written in `src/pages/PageHome.vue:135-139`:

| Field | Type | Set where |
| --- | --- | --- |
| `content` | string, max 280 chars (enforced only by `maxlength` on the input, `src/pages/PageHome.vue:10`) | on create |
| `date` | number — `Date.now()` epoch milliseconds, not a Firestore `Timestamp` | on create |
| `liked` | boolean, initially `false` | on create, toggled by `toggleLiked` |

The Firestore document id is not stored in the document; it is copied onto the local object as `qweet.id` when a change arrives (`:176-177`) and is what `deleteQweet` and `toggleLiked` address (`:149`, `:156`).

There is no `author`, `userId` or any ownership field. Authorship is presentational and hard-coded (`:61-63`).

## Reading: the snapshot listener

`mounted()` attaches one listener (`src/pages/PageHome.vue:174-193`):

```js
db.collection('qweets').orderBy('date').onSnapshot(snapshot => { ... })
```

It iterates `snapshot.docChanges()` and reconciles the local `qweets` array by change type:

- `added` → `unshift`, so documents arriving in ascending `date` order end up displayed newest-first;
- `modified` → `findIndex` by id then `Object.assign` onto the existing object, which updates in place and does **not** re-sort;
- `removed` → `findIndex` then `splice`.

Each branch also `console.log`s the change. The listener's unsubscribe function is discarded, and the page is wrapped in `<keep-alive>` (`src/layouts/MainLayout.vue:118-120`), so it is attached once for the lifetime of the app and never detached.

`data().qweets` starts empty; the array above it in the file is a block of commented-out sample qweets (`:117-130`) left from before Firestore was wired in, along with the commented `this.qweets.unshift(newQweet)` at `:140` that the listener replaced.

## Writing

All three mutations are fire-and-forget promises whose only handling is a `console.log` on success and a `console.error` on failure — nothing reaches the user:

- `addNewQweet` — `db.collection('qweets').add(newQweet)`, then clears the input synchronously without waiting (`:141-146`);
- `deleteQweet` — `.doc(qweet.id).delete()` (`:149-153`);
- `toggleLiked` — `.doc(qweet.id).update({ liked: !qweet.liked })` (`:156-165`).

None of them mutate local state; the UI updates only when the snapshot listener fires back, which is why the app looks correct offline-optimistically only as far as the SDK's own local cache goes.

## Security

No Firestore security rules are in this repository (no `firestore.rules`, no `firebase.json`), and the README's instruction is to start the database in test mode — which leaves the collection world-readable and world-writable for the rule set's expiry window. Anyone with the web config can create, edit and delete any qweet. See [known-issues](./known-issues.md).

Note also that `src/boot/firebase.js` is tracked and not in `.gitignore`, so following the README literally commits your Firebase web config.

See also [overview](./overview.md), [architecture-decisions](./architecture-decisions.md).

---

<sub>Wiki page `firebase-and-the-qweets-collection` · revision 1 · last written by agent · maintained in Forge's wiki mode. Editing this file does not change the wiki.</sub>
