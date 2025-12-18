console.log("[FocusWhileAI] Background script loaded.");

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  console.log("[FocusWhileAI] Event triggered. Reason:", details.reason);

  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("onboarding.html"),
      active: true,
    });

    console.log("[FocusWhileAI] Onboarding tab opened.");
  }
});
