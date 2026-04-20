# Android APK Workflow

## Why Remote URL Is Needed

The current app includes Next.js API routes (`/api/*`) for slokas/sessions.  
A fully static web export cannot serve these routes inside the APK.

Use Capacitor with a deployed web URL:

1. Deploy web app
2. Point Capacitor server URL to deployment
3. Build native APK

## Commands (PowerShell)

```powershell
Set-Location C:\Users\Viv\Documents\Codex\Project_APP\Project_APP_Web
$env:CAPACITOR_APP_URL="https://your-deployed-app-url"
npm run android:sync
npm run android:open
```

Then build from Android Studio.

## Output Location

After Android Studio debug build, APK is typically at:

`android\app\build\outputs\apk\debug\app-debug.apk`

## Notes

1. `capacitor.config.ts` reads `CAPACITOR_APP_URL` at sync time.
2. If URL is not set, Capacitor loads local `mobile-web/index.html` fallback.
3. For release APK, configure signing in Android Studio/Gradle.
