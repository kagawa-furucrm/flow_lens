console.log('Content script running...');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  sendResponse({ status: 'Message received in content script' });
});
