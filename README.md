# Song Studio — AI Music Creator + Music Editor

Song Studio combines an AI song-generation workflow with a lightweight, browser-based editor for music files you have the right to use.

## Music editor
Open [Music Editor](./editor.html) to:
- Import local audio files supported by the browser.
- Preview the waveform and play the selected section.
- Trim by start/end time.
- Adjust output volume, fade-in and fade-out.
- Optionally peak-normalize the rendered audio toward -1 dB.
- Export the edited selection as a WAV file.

Audio editing and WAV rendering run locally in the browser; the editor does not upload the imported audio to a server. Large or long audio files require sufficient device memory.

## AI song creator
The home page keeps the existing lyrics-to-song workflow:
- Paste or upload lyrics.
- Choose Afrobeats, Amapiano, Melodic Trap, Drill, R&B, Contemporary Gospel or Dancehall.
- Set tempo and request a generated song.
- Play and download the result.
- Optional music-video workflow for audio you own or are licensed to use.

AI generation requires the repository's server-side API configuration. Do not expose provider API keys in client-side code.

## Run locally
Open `index.html` through a local static server for the best browser compatibility. The editor itself uses the Web Audio API and requires a modern browser.

## Important
Import only audio you own or have permission to edit. Export format is currently 16-bit PCM WAV. MP3 export and advanced multi-track arrangement are not implemented yet.
