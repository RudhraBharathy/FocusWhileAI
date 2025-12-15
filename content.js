const SITES = {
  chatgpt: {
    host: "chatgpt.com",
    generatingSelector: '[data-testid="stop-button"]', 
  },
  gemini: {
    host: "google.com", 
    generatingSelector: '[aria-label="Stop response"], [aria-label="Stop generating"]', 
  },
  claude: {
    host: "claude.ai",
    generatingSelector: 'button[aria-label="Stop response"]', 
  },
  perplexity: {
    host: "perplexity.ai",
    generatingSelector: 'button[aria-label="Stop generating response"]', 
  },
  copilot: {
    host: "microsoft.com",
    generatingSelector: '[aria-label="Interrupt message"]',
  },
  grok: {
    host: "grok.com",
    generatingSelector: '[aria-label="Stop model response"]',
  }
};

let isOverlayActive = false;
let currentSiteConfig = null;

const hostname = window.location.hostname;
for (const key in SITES) {
  if (hostname.includes(SITES[key].host)) {
    currentSiteConfig = SITES[key];
    console.log(`[AI Waiter] Detected Site: ${key}`);
    break;
  }
}

function createOverlay() {
  if (document.getElementById('ai-bubble-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'ai-bubble-overlay';
  
  const header = document.createElement('div');
  header.id = 'ai-bubble-header';
  header.innerText = "Generating Response... Pop some bubbles!";
  
  const grid = document.createElement('div');
  grid.id = 'ai-bubble-grid';

  for (let i = 0; i < 48; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    bubble.addEventListener('mousedown', () => {
        if (!bubble.classList.contains('popped')) {
            bubble.classList.add('popped');
            playPopSound();
        }
    });
    
    grid.appendChild(bubble);
  }

  overlay.appendChild(header);
  overlay.appendChild(grid);
  document.body.appendChild(overlay);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playPopSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function resetBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(b => b.classList.remove('popped'));
}

// 4. DETECTION LOGIC
function checkStatus() {
  if (!currentSiteConfig) return;

  const isGenerating = document.querySelector(currentSiteConfig.generatingSelector);

  const overlay = document.getElementById('ai-bubble-overlay');
  if (!overlay) return;

  if (isGenerating && !isOverlayActive) {
    isOverlayActive = true;
    overlay.classList.add('active');
  } else if (!isGenerating && isOverlayActive) {
    isOverlayActive = false;
    overlay.classList.remove('active');
  }
}

if (currentSiteConfig) {
  createOverlay();

  const observer = new MutationObserver((mutations) => {
    checkStatus();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
}
