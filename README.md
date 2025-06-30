# Sextify

Spotify API client capable of logging in with user accounts and *downloading*

- AAC fully supported
- OGG does not work, but it's properly supported and implemented and will work with proper DRM keys

#### Dependencies
- Node 18+
- [FFmpeg](https://www.ffmpeg.org/)

## Usage

```
npm install --save sextify
```


```ts
import { SpotifyApi } from "sextify";

// yes, no auth required, this line actually works (by getting a public shared cookie)
const s = await SpotifyApi.withClientApplication()

await s.tracks.fetch("3pkXNBtkg8E2xRAKrnu43s", "./test.m4a");          // download

s.tracks.fetch("3pkXNBtkg8E2xRAKrnu43s", {ffmpeg: {format: "mpegts"}}) // stream
        .then(r=>r.pipe(...))      
```

### Authentication

You can (and should) import your own sp_dc cookie from your browser to use with your own account, library, algorithms, etc.

sp_t cookie is only required for `pathfinder.home` endpoint, so you probably won't need it.

```ts
await SpotifyApi.withClientApplication({
    // use either cookies or token
    cookies: "sp_dc=12345; sp_t=54321",

    // optional if cookies are set, but recommended to avoid authenticating every time; otherwise required
    // accessToken usually expires in a hour, and is refreshed with proper cookies
    token: {                            
        accessToken: "12345",
        accessTokenExpirationTimestampMs: 1234567890
    },

    // optional, same as token, except only required for pathfinder, lyrics, inspiredBy endpoints
    clientToken: {
        token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        refresh_after_seconds: 1234560690
    }
})
```

### Widevine DRM (AAC)

Public device keys are used by default and seem to work perfectly, but you can provide your own if you want:

1. Use [KeyDive](https://github.com/hyugogirubato/KeyDive) and any rooted Android device
2. ```ts
    await SpotifyApi.withClientApplication({
        /// ...
        widevineDevice: parseWidevineDevice(await readFile("./oneplus_cph2585_16.0.1@007_756dffe2_29559_l3.wvd"))
    })
    ```

### PlayPlay DRM (OGG)

Neither keys or unplayplay are shipped with the library, but if you manage to get them:

```ts
import unplayplay from "unplayplay";

await SpotifyApi.withClientApplication({
    /// ...
    unplayplay
})
```
    
