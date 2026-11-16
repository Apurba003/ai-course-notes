# NotePilot AI

Responsive MVP for turning a course transcript into timestamped study notes. It runs locally in the browser, accepts `.txt`, `.srt`, and `.vtt` files, plays a user-selected local video, and keeps notes synced to video timestamps. Notes, flashcards, and a glossary are generated without uploading the lesson.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This MVP intentionally does not bypass DRM or download protected course content. A production version should connect a secure backend to an approved speech-to-text and vision model, preserving source timestamps for verification.
