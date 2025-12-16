export const SITES = {
  chatgpt: {
    host: "chatgpt.com",
    selector: 'button[aria-label="Stop streaming"]', 
  },
  gemini: {
    host: "gemini.google.com", 
    selector: '[aria-label="Stop response"], [aria-label="Stop generating"]', 
  },
  claude: {
    host: "claude.ai",
    selector: 'button[aria-label="Stop response"]', 
  },
  perplexity: {
    host: "perplexity.ai",
    selector: 'button[aria-label="Stop generating response"]', 
  },
  copilot: {
    host: "microsoft.com",
    selector: 'button[aria-label="Interrupt message"]',
  },
  grok: {
    host: "grok.com",
    selector: 'button[aria-label="Stop model response"]',
  }
};

export function getCurrentSite() {
    const hostname = window.location.hostname;
    for (const key in SITES) {
        if (hostname.includes(SITES[key].host)) {
            return SITES[key];
        }
    }
    return null;
}

export function isAIThinking(siteConfig) {
    if (!siteConfig) return false;
    return !!document.querySelector(siteConfig.selector);
}