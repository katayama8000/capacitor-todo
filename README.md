# Capacitor Todo

A minimal todo app built with [Capacitor](https://github.com/ionic-team/capacitor),
Vite and TypeScript. No framework, no backend — todos are stored on the device
with the Capacitor Preferences plugin, so the same code persists data on iOS,
Android and the web.

## Features

- Add, complete and delete todos
- Todos survive an app restart (Capacitor Preferences)
- Light and dark theme, safe-area aware layout

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | Markup and element ids the app binds to |
| `src/main.ts` | State, rendering and event handling |
| `src/storage.ts` | Load/save todos through Capacitor Preferences |
| `src/types.ts` | The `Todo` type |
| `src/style.css` | Styling and theme tokens |
| `capacitor.config.ts` | App id, app name and `webDir` |

## Run in the browser

```bash
npm install
npm run dev
```

## Run on a device

Capacitor copies the built web assets (`dist`) into a native project.

```bash
# Install the native platforms once
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Then, after every web change
npm run build
npx cap sync

npx cap open ios      # needs Xcode + CocoaPods
npx cap open android  # needs Android Studio
```

## Run on the desktop (Electron)

Desktop is not an official Capacitor platform; it uses the community
[`@capacitor-community/electron`](https://github.com/capacitor-community/electron)
platform, already set up in `electron/`.

```bash
npm run electron:start   # build the web app, sync it, open the Electron window
npm run electron:pack    # produce an unpacked desktop build in electron/dist
```

Preferences has no Electron-specific implementation, so it falls back to the web
one — todos are stored in the Electron renderer's localStorage, inside the app's
user-data directory.

Note: `electron/tsconfig.json` sets `skipLibCheck: true`. Some of the template's
own dependencies ship type definitions that do not compile against the installed
`@types/node`, which otherwise breaks `npm run build` in `electron/`.
