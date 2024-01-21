chrome.runtime.onInstalled.addListener(function () {
  // Create context menu item
  chrome.contextMenus.create({
    id: "ClickableObject_CO",
    title: "Remove Clickable Object",
    contexts: ["all"],
    documentUrlPatterns: ["*://www.google.com/*"],
  });
});

// Action when clicking on the Context menu item
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "ClickableObject_CO") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        document
          .querySelectorAll(".clickableObject_CO")
          .forEach((el) => el.remove());
      },
    });
  }
});
