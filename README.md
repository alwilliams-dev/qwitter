# Qwitter (qwitter)

A Cross-Platform Twitter Clone created with Quasar Framework, VueJS & Firebase

## Features

### Core Features
- **Post Creation** - Create and share posts (qweets) up to 280 characters
- **Like Posts** - Mark your favorite posts with a heart
- **Delete Posts** - Remove posts you've created
- **Real-time Updates** - Live feed updates using Firebase Firestore

### New Features: Bookmark Collections & Sharing
- **Bookmark Collections** - Save posts to organized, labeled collections
- **Create Collections** - Build multiple collections for different topics or purposes
- **Share Collections** - Generate shareable links to share collections with friends
- **View Shared Collections** - Browse collections shared by others (read-only access)

For detailed information on the new collections features, see [FEATURES.md](FEATURES.md)

## Setup Firebase
- Create a new Firebase project named Qwitter
- Create a Web App named Qwitter
- Copy the config from the code sample that appears and add it to src/boot/firebase.js
- Create a Cloud Firestore database - make sure you choose "Start in test mode"
- Create a `collections` collection in Firestore (optional - it will be created automatically on first use)

## Install the dependencies
```bash
npm install
```

## Web Version

### Start in development mode
```bash
quasar dev
```

### Build for production
```bash
quasar build
```

## Desktop Version (Electron)

### Start in development mode
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

### Start in development mode
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

### Start in development mode
```bash
quasar dev -m cordova -T android
```

### Build for production
```bash
quasar build -m cordova -T android
```

## Project Structure

```
src/
├── boot/
│   └── firebase.js          # Firebase configuration
├── layouts/
│   └── MainLayout.vue       # Main app layout with navigation
├── pages/
│   ├── PageHome.vue         # Home feed with bookmarking
│   ├── PageCollections.vue  # Collections management
│   ├── PageSharedCollections.vue  # Shared collections viewer
│   ├── PageAbout.vue        # About page
│   └── Error404.vue         # 404 error page
├── router/
│   ├── index.js             # Router configuration
│   └── routes.js            # Route definitions
├── App.vue
└── index.template.html
```

## How to Use the Collections Feature

### Creating a Collection
1. Click **Collections** in the sidebar
2. Click **New Collection**
3. Enter the collection name and optional description
4. Click **Create**

### Bookmarking Posts
1. On the Home feed, locate the post you want to save
2. Click the **bookmark icon** (the 4th icon from the left in the post toolbar)
3. Select a collection or create a new one
4. The bookmark icon will turn blue when bookmarked

### Viewing Collections
1. Click **Collections** in the sidebar
2. Click on any collection card to view all bookmarked posts
3. Remove individual posts with the **Remove** button
4. Delete entire collections with the **Delete** button

### Sharing Collections
1. In the Collections page, click **Share** on any collection
2. Copy the generated link
3. Share the link with friends
4. Friends can view the collection by visiting the link in their browser

## Technologies Used

- **Frontend**: Vue.js, Quasar Framework
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: SASS
- **Date Formatting**: date-fns
- **Desktop**: Electron
- **Mobile**: Cordova

## License

See LICENSE file for details
