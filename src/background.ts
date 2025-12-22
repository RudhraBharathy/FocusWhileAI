console.log("[FocusWhileAI] Background script loaded.");

chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    console.log("[FocusWhileAI] Event triggered. Reason:", details.reason);

    if (details.reason === "install" || details.reason === "update") {
      chrome.tabs.create({
        url: chrome.runtime.getURL("onboarding.html"),
        active: true,
      });

      console.log("[FocusWhileAI] Onboarding tab opened.");
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
