# Qwitter (qwitter)

A Cross-Platrom Twitter Clone created with Quasar Framework, VueJS & Firebase

## Bookmarks & Messaging

- Tap the bookmark icon on any qweet to save it - a bookmark is stored as a `bookmarked` flag on the qweet itself.
- The **Bookmarks** page lists everything you have saved. Select any number of bookmarks, hit **Send to friends**, pick one or more friends and (optionally) add a note.
- Sending writes one document per recipient to the `messages` Cloud Firestore collection. Each document holds the recipient, your note and a copy of every shared qweet, so a message still reads correctly after the original qweet is deleted or un-bookmarked.
- The **Messages** page lists the bookmark collections you have sent and lets you delete them.

Qwitter has no accounts system yet, so the friends you can message are defined in `src/data/friends.js`.

## Setup Firebase
- Create a new Firebase project named Qwitter
- Create a Web App named Qwitter
- Copy the config from the code sample that appears and add it to src/boot/firebase.js
- Create a Cloud Firestore database - make sure you choose "Start in test mode"

## Install the dependencies
```bash
npm install
```

## Web Version

### Start  in development mode
```bash
quasar dev
```

### Build for production
```bash
quasar build
```

## Desktop Version (Electron)

### Start  in development mode
```bash
quasar dev -m electron
```

### Build for production
To build for different platforms, change the `electron > packager > platform` setting in `quasar.conf.js` to `win32`, `darwin`, `mas` or `linux` 
```bash
quasar build -m electron
```

## iOS Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Install Xcode

[Install Xcode](https://developer.apple.com/download/more/)

### Start  in development mode
```bash
quasar dev -m cordova -T ios
```

### Start on other Simulator Devices
```bash
cd src-cordova
cordova run ios --list
cd ..
quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
```

### Build for production
```bash
quasar build -m cordova -T ios
```

## Android Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Follow all steps on Quasar site

[Follow all steps on Quasar site](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup)

### Launch Android Virtual Device
Android Studio > Configure > AVD Manager > Launch an AVD

### Start  in development mode
```bash
quasar dev -m cordova -T android
```

### Build for production
```bash
quasar build -m cordova -T android
```