# Sextify

Spotify API client capable of logging in with user accounts and *downloading*

- AAC fully supported
- OGG does not work, but it's properly supported and implemented and will work with proper DRM keys

#### Dependencies
- Node 18+
- [FFmpeg](https://www.ffmpeg.org/)

## Usage

The very basic, out of the box usage:

```ts
import { SpotifyApi } from "sextify";

const s = await SpotifyApi.withClientApplication()

await s.tracks.fetch("3UvrVcjAVGK41riSOVgC8w", "./test.m4a");          // download

s.tracks.fetch("3UvrVcjAVGK41riSOVgC8w", {ffmpeg: {format: "mpegts"}}) // stream
        .then(r=>r.pipe(...))      
```

### Authentication

You can (and should) import your own sp_dc cookie:

```ts
await SpotifyApi.withClientApplication({
    cookies: "sp_dc=12345",

    // optional, auth and token update are automated when cookies are set
    token: {                            
        accessToken: "12345",
        accessTokenExpirationTimestampMs: 1234567890
    }
})
```

### Widevine DRM

Public device keys are used by default, but you can provide your own:
1. Use [KeyDive](https://github.com/hyugogirubato/KeyDive) and any rooted Android device
2. ```ts
    await SpotifyApi.withClientApplication({
        widevineDevice: parseWidevineDevice(await readFile("./oneplus_cph2585_16.0.1@007_756dffe2_29559_l3.wvd"))
    })
    ```
    