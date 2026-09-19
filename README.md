# ReadingBuddy

> An early prototype exploring a reading companion that listens to a child reading aloud and steps in when they appear to be struggling.

ReadingBuddy is a human-centred AI/product experiment.

The core idea is simple: instead of making a child stop reading to ask for help, the software should be able to **listen, notice difficulty and offer assistance at the right moment**.

The current repository is a working browser prototype. Some capabilities are implemented with browser speech APIs and deterministic heuristics; the conversational AI layer is currently simulated.

---

## The idea

A child reads a book aloud.

ReadingBuddy listens for signals such as:

- hesitation
- repeated words
- low speech-recognition confidence

When a possible struggle is detected, the prototype can:

- identify the word
- look up word difficulty/context
- explain the word when data is available
- speak the word aloud
- offer encouragement
- track words that needed help
- turn difficult words into later practice

The broader product idea is a **surrogate reading companion**: a patient, always-available helper that supports the child without taking over the reading experience.

---

## Current experience

### 📚 Book selection
The prototype includes a book-scanning flow and current-book context.

### 🎙️ Read aloud
The browser's Web Speech API is used for continuous speech recognition.

The application captures recognised words and their confidence scores while the child reads.

### 🧠 Struggle detection
The current prototype uses deterministic signals rather than an LLM:

- hesitation beyond a threshold
- repetition of recent words
- low speech-recognition confidence

This produces a deliberately simple intervention loop:

**listen → detect signal → identify word → help → continue reading**

### 🔊 Spoken assistance
Browser text-to-speech can:

- say a difficult word
- pronounce phonetic components
- explain a definition
- provide encouragement

### 💬 Questions
The UI also contains a question-and-answer experience.

The current implementation intentionally simulates the AI response rather than calling a production LLM API. This keeps the prototype focused on the interaction model before introducing model infrastructure.

### 🎮 Practice
The application tracks words that caused difficulty so they can be revisited in a practice/game flow.

---

## Product philosophy

The interesting product question is not simply:

> “Can AI help a child read?”

It is:

> **“How can technology intervene at exactly the moment help is useful, while keeping the child in control of the reading experience?”**

That leads to several design principles:

**Intervene lightly.**

A pause or uncertain recognition should trigger help, not a disruptive workflow.

**Prefer encouragement to correction.**

The companion should feel like a supportive reading partner rather than a teacher constantly marking mistakes.

**Keep the child reading.**

The ideal intervention is quick enough that the reading flow continues.

**Make the system explainable.**

The current prototype exposes the signals that caused an intervention rather than hiding them behind a black-box model.

---

## Architecture

```text
Child reading aloud
        |
        v
Browser Speech Recognition
        |
        v
Word / confidence events
        |
        +----------------------+
        |                      |
        v                      v
Struggle heuristics       Word database
        |                      |
        +----------+-----------+
                   |
                   v
             Help experience
              /           \
             v             v
       Text-to-speech    UI guidance
                   |
                   v
             Session history
```

### Stack

| Layer | Technology |
|---|---|
| UI | React |
| Build | Vite |
| Routing | React Router |
| Icons | Lucide React |
| Speech recognition | Web Speech API |
| Text-to-speech | Web Speech API |
| Styling | CSS |
| Data | Local JavaScript word database |

---

## What is implemented vs explored

| Capability | Current state |
|---|---|
| Speech recognition | Implemented in browser |
| Text-to-speech | Implemented in browser |
| Hesitation detection | Implemented |
| Repetition detection | Implemented |
| Confidence-based detection | Implemented |
| Word help | Implemented |
| Book scanning flow | Prototype |
| Reading sessions | Implemented |
| Practice/game flow | Implemented |
| Conversational AI | Simulated |
| Production LLM integration | Not yet implemented |
| Cloud backend | Not yet implemented |

Being explicit about this distinction is intentional. The repository is a prototype exploring the product and interaction model, not a claim of a finished AI platform.

---

## Engineering details

The repository contains separate modules for speech recognition and speech synthesis.

The reading experience maintains session state such as:

- reading duration
- words requiring help
- current book
- assistant messages

The detection logic considers a combination of timing, repetition and recognition confidence rather than relying on a single signal.

That makes the current prototype easy to inspect and iterate before introducing more sophisticated models.

---

## Where AI could go next

The current architecture leaves clear extension points for AI.

Possible future work includes:

### Context-aware assistance

Use the current book and surrounding sentence context to improve explanations instead of relying mainly on a word database.

### Adaptive difficulty

Learn which words and patterns are challenging for a particular reader and adjust practice accordingly.

### Conversational comprehension

Replace the simulated Q&A flow with an LLM that can answer questions about the story while being constrained by the book context.

### Multimodal book understanding

Combine photographed/scanned pages with OCR or vision models so the assistant understands the actual text being read.

### Parent-facing insights

Provide progress summaries without turning the product into a surveillance dashboard.

---

## Responsible AI considerations

This is a child-facing concept, so the eventual production design would need stronger safeguards than the current prototype.

Important future considerations include:

- minimising collection and retention of children's data
- clear parental controls and consent
- avoiding unnecessary storage of speech recordings
- carefully constraining generated explanations
- making it clear when the system is uncertain
- preventing the assistant from becoming a substitute for appropriate adult support

These are product requirements, not just implementation details.

---

## Current status

ReadingBuddy is an early experimental build.

The repository was created to explore the interaction model and technical feasibility of a voice-enabled reading companion before committing to a production architecture.

That makes it a useful prototype for exploring:

**human-centred AI + speech interfaces + adaptive assistance + product experimentation**

---

## Running locally

### Prerequisites

- Node.js
- npm

### Start development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

The speech features depend on browser support for the Web Speech API.

---

## Why this project matters to my engineering practice

ReadingBuddy is an example of a different kind of engineering problem from my larger application projects.

The challenge is not primarily scale or infrastructure.

It is **designing the boundary between a human and an intelligent system**.

That is exactly the kind of problem I want to explore as AI changes the way software products are designed.
