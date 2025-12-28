chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    if (details.reason === "install" || details.reason === "update") {
      chrome.tabs.create({
        url: chrome.runtime.getURL("onboarding.html"),
        active: true,
      });
    }
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FETCH_STOIC_QUOTE") {
    fetch(import.meta.env.VITE_STOIC_QUOTE_API_URL)
      .then((response) => response.json())
      .then((apiResponse) => {
        sendResponse({ success: true, data: apiResponse.data });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});

chrome.runtime.setUninstallURL("https://tally.so/r/BzKrGN");