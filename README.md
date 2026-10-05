# 🎵 Song Studio

**AI Song Generator + AI Music Video Creator**

Song Studio turns your lyrics and creative direction into an original AI-generated song, then lets you create a cinematic music video from generated or user-provided audio.

> **Built from Nigeria 🇳🇬 — for creators everywhere.**

## ✨ What it does

### 🎤 AI Song Generator
- Paste lyrics or upload a .txt / .md lyric file
- Choose a genre
- Set the BPM
- Generate a complete song with **MiniMax Music 2.6**
- AI vocals + instrumentation + arrangement
- Play the generated song in the browser
- Download the result as MP3

### 🎬 AI Music Video Creator
Switch to **Music Video** mode to create visuals with MiniMax video generation.

You can:
- Use a song generated inside Song Studio
- Upload an audio file you own or have permission to use
- Describe the visual concept
- Generate AI video
- Combine the generated visual with your selected audio
- Download the finished music video

### 🎨 Visual experience
The interface uses browser-native **HTML Canvas** graphics for animated particles, ambient lighting, audio-inspired waveforms, hero artwork and cinematic background effects.

## 🎼 Supported genres

Current presets include:
- Afrobeats
- Amapiano
- Melodic Trap
- Drill
- R&B
- Contemporary Gospel
- Dancehall

## 🧠 Architecture

~~~text
                         SONG STUDIO
                              │
                ┌─────────────┴─────────────┐
                │                           │
          SONG GENERATOR              MUSIC VIDEO
                │                           │
       MiniMax Music 2.6             MiniMax Video
                │                           │
          AI vocals + music             AI visuals
                │                           │
                └─────────────┬─────────────┘
                              │
                       Browser player
                              │
                         Download
~~~

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Browser media APIs
- HTML Canvas

### Backend
Vercel serverless API routes keep provider credentials out of the browser:
- /api/generate — AI song generation
- /api/video — AI video generation

### AI provider
The current implementation uses **MiniMax models through Replicate**:
- MiniMax Music 2.6 — song generation
- MiniMax Video-01 — video generation

## 🔐 Environment variables

Create a Vercel environment variable:

~~~env
REPLICATE_API_TOKEN=your_replicate_token
~~~

**Never commit the token to GitHub or expose it in client-side JavaScript.**

## 🚀 Local development

Clone the repository:

~~~bash
git clone https://github.com/jbnikky13/beat-generator.git
cd beat-generator
~~~

Install Vercel CLI if needed:

~~~bash
npm install -g vercel
~~~

Link the project:

~~~bash
vercel link
~~~

Add your Replicate token:

~~~bash
vercel env add REPLICATE_API_TOKEN development
~~~

Then run:

~~~bash
vercel dev
~~~

## 🌐 Deployment

Production:
https://beat-generator-one.vercel.app

Repository:
https://github.com/jbnikky13/beat-generator

## 🎧 Spotify and copyrighted music

Song Studio does **not** download, rip, or extract audio from Spotify.

A Spotify URL may be used as a reference, but creating a music video from existing music requires an audio file that the user owns or is licensed/authorized to use.

Do not upload copyrighted recordings unless you have the necessary rights or permission.

## 📁 Project structure

~~~text
beat-generator/
├── api/
│   ├── generate.js       # MiniMax Music generation
│   └── video.js          # MiniMax video generation
├── index.html            # Song Studio interface
├── app.js                # UI and media workflow
├── styles.css            # Responsive UI + Canvas graphics
├── vercel.json
└── README.md
~~~

## 🛡️ Security

The Replicate API token is accessed only from the Vercel server environment.

~~~js
process.env.REPLICATE_API_TOKEN
~~~

The browser never needs to receive the provider secret.

For production, consider adding authentication, rate limiting, per-user generation limits, usage tracking, generation history and persistent storage.

## 🗺️ Roadmap

### Phase 1 — Core
- [x] Lyrics input
- [x] Lyrics file upload
- [x] Genre selection
- [x] BPM control
- [x] AI song generation
- [x] Audio playback
- [x] MP3 download

### Phase 2 — Music Video
- [x] Music video mode
- [x] Audio upload
- [x] AI visual generation
- [x] Audio/video composition
- [x] Video download

### Phase 3 — Creator Studio
- [ ] AI-generated cover art
- [ ] Multiple video scenes
- [ ] Scene-by-scene prompts
- [ ] Automatic lyric subtitles
- [ ] Artist/avatar generation
- [ ] Better audio-reactive visuals
- [ ] Generation history
- [ ] Saved projects

### Phase 4 — Creator Platform
- [ ] User accounts
- [ ] Cloud project storage
- [ ] Credits/subscriptions
- [ ] Public song pages
- [ ] Shareable music videos
- [ ] Creator profiles
- [ ] Analytics

## ⚠️ Current limitations

- AI generation requires a configured Replicate account and API token.
- AI generation incurs provider usage costs.
- Video generation currently produces short AI visual clips that can be composed with longer audio.
- Browser-based audio/video composition depends on browser media API support.
- Generated content should be reviewed by the creator before publishing.

## 📄 License

See the repository license for the current licensing terms.

---

**Song Studio — turn your lyrics into songs, then turn your songs into worlds. 🎵🎬**
