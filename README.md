# ⏳ FocusWhileAI

> **Turn the "Waiting Gap" into a Micro-Learning Engine**

**FocusWhileAI** is a smart Chrome Extension that transforms the idle moments spent waiting for AI responses (ChatGPT, Gemini, Claude, Perplexity, Copilot, Grok) into high-value micro-learning opportunities. Instead of getting distracted by social media during the 10-20 second "generating" phase, users are presented with a personalized, glanceable feed of interests—keeping them focused, engaged, and in flow.

---

## 🚀 Features

- **⚡ Zero-Friction Identity:** No emails or passwords. Just claim a unique username to sync your preferences.  
- **🧠 Micro-Learning Deck:** Cycles through bite-sized cards (5-second reads) while the AI thinks.  
- **🎨 Personalized Feed:** Users select their "Flow Triggers":
  - **💻 Coding:** Syntax tips, Regex patterns, VS Code shortcuts.  
  - **📈 Finance:** Live market pulses and economic terms.  
  - **🧘 Zen:** Breathwork visuals and mindfulness prompts.  
  - **🎮 Gaming:** Trivia and facts.  
- **🤖 Smart Detection:** Automatically detects the "generating" state of major AI models and vanishes instantly when the answer is ready.  
- **🛡️ Shadow DOM Injection:** Uses isolated styling that never conflicts with the LLM websites.  

---

## 🌐 Supported Platforms

- [x] **ChatGPT** (OpenAI)  
- [x] **Gemini** (Google)  
- [x] **Claude** (Anthropic)  
- [x] **Perplexity AI**  
- [x] **Microsoft Copilot**  
- [x] **Grok**  

---

## 🛠️ Tech Stack

This project uses modern Chrome Extensions:

- **Frontend:** [React 18](https://react.dev/) - Component-based UI.  
- **Build Tool:** [Vite](https://vitejs.dev/) + [CRXJS](https://crxjs.dev/vite-plugin) - Instant HMR (Hot Module Reloading) for extensions.  
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling injected via Shadow DOM.  
- **Backend:** [Firebase](https://firebase.google.com/) - Firestore (NoSQL Database) & Auth.

---

### Clone the Repository
```bash
git clone https://github.com/yourusername/focus-while-ai.git
cd focus-while-ai
```
---
## 📝 License

Distributed under the MIT License. See LICENSE for more information.