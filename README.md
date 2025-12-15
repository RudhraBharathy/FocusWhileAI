# While AI - Stay Focused While AI Thinks

A Chrome extension that helps you stay focused while waiting for AI responses by providing a fun, interactive bubble wrap game during loading times.

## Features

- 🎮 Interactive bubble wrap game appears automatically when AI is thinking
- 🎶 Satisfying pop sound effects
- ⚡ Lightweight and fast (under 50KB)
- 🔒 Privacy focused - no tracking or data collection
- 🔌 Zero configuration required

## Supported Platforms

- Google Gemini
- OpenAI ChatGPT
- Anthropic Claude
- Perplexity AI
- Microsoft Copilot
- xAI Grok

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension directory

## How It Works

The extension uses MutationObserver to detect when an AI starts generating a response. When it detects the loading state, it displays a bubble wrap game overlay. The game automatically disappears when the AI finishes responding.

## Development

Built with:
- Vanilla JavaScript
- CSS Grid
- Web Audio API (for sound effects)

## License

MIT