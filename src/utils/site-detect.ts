export type SiteConfig = {
  host: string;
  selector: string;
};

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
