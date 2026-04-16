// src/content/content-script.ts
//
// Minimal content script. Does NOT read DOM or modify the page.
// Sole purpose: respond to GET_HOSTNAME messages from the service worker
// with the current page's hostname. The service worker prefers
// chrome.tabs.query() and only messages content scripts as a fallback.

interface HostnameRequest {
  type: 'GET_HOSTNAME';
}

interface HostnameResponse {
  hostname: string;
}

chrome.runtime.onMessage.addListener(
  (message: HostnameRequest, _sender, sendResponse: (r: HostnameResponse) => void) => {
    if (message?.type === 'GET_HOSTNAME') {
      sendResponse({ hostname: window.location.hostname });
      return true;
    }
    return false;
  }
);

export {};
