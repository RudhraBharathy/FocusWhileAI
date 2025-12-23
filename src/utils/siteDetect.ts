export type SiteConfig = {
  name: string;
  host: string;
  selector: string;
};

export const SITES = {
  chatgpt: {
    name: "ChatGPT",
    host: "chatgpt.com",
    selector: 'button[aria-label="Stop streaming"]',
  },
  gemini: {
    name: "Gemini",
    host: "gemini.google.com",
    selector: '[aria-label="Stop response"], [aria-label="Stop generating"]',
  },
  claude: {
    name: "Claude",
    host: "claude.ai",
    selector: 'button[aria-label="Stop response"]',
  },
  perplexity: {
    name: "Perplexity",
    host: "perplexity.ai",
    selector: 'button[aria-label="Stop generating response"]',
  },
  copilot: {
    name: "Copilot",
    host: "microsoft.com",
    selector: 'button[aria-label="Interrupt message"]',
  },
  grok: {
    name: "Grok",
    host: "grok.com",
    selector: 'button[aria-label="Stop model response"]',
  },
} satisfies Record<string, SiteConfig>;

export function getCurrentSite(): SiteConfig | null {
  const hostname = window.location.hostname;

  for (const key in SITES) {
    const site = SITES[key as keyof typeof SITES];
    if (hostname.includes(site.host)) {
      return site;
    }
  }

  return null;
}

export function isAIThinking(siteConfig: SiteConfig | null): boolean {
  if (!siteConfig) return false;
  return Boolean(document.querySelector(siteConfig.selector));
}
