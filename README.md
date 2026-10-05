# 🎵 Song Studio

**Suno-powered AI Song Creator**

Song Studio turns your lyrics into songs with **Suno**. Write or upload lyrics, choose a genre and tempo, generate, play, and download.

## Features
- Lyrics paste/upload
- Afrobeats, Amapiano, Melodic Trap, Drill, R&B, Contemporary Gospel and Dancehall
- BPM control
- Suno Custom Mode generation
- Browser playback
- MP3 download
- Optional music-video workspace

## Architecture
```
Song Studio (Vercel)
       ↓
/api/generate
       ↓
Suno API (gcui-art/suno-api)
       ↓
Suno
       ↓
Audio URL
       ↓
Play / Download
```

The upstream project is an **unofficial** Suno integration. It documents Vercel deployment plus `/api/custom_generate`, `/api/get`, and `/api/get_limit`. citeturn0view0turn1view0

## Vercel configuration

Deploy the upstream Suno API separately and add:

```env
SUNO_API_URL=https://your-suno-api.vercel.app
```

The upstream service requires its own private Suno configuration. Its current documentation lists `SUNO_COOKIE` and, for its CAPTCHA flow, `TWOCAPTCHA_KEY`. citeturn0view0

**Never put your Suno cookie in GitHub, `index.html`, or client-side JavaScript.**

## Setup

1. Deploy `gcui-art/suno-api` to Vercel.
2. Configure its required private environment variables.
3. Verify `/api/get_limit`.
4. Add `SUNO_API_URL` to this Song Studio project.
5. Redeploy Song Studio.
6. Generate a song.

The upstream project says its demo is bound to a test/free Suno account and has daily limits. citeturn0view0

## Important

The upstream project states that it is unofficial and intended for learning/research purposes. citeturn0view0 Use Suno according to the terms and rights applicable to your account.

## Structure
```
beat-generator/
├── api/
│   ├── generate.js
│   └── video.js
├── index.html
├── app.js
├── styles.css
└── README.md
```

**Song Studio — write it. Suno sings it. 🎵**
