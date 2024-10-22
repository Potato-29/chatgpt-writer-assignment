export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message) {
      console.log("Content script sent message:", message);
    }
  });
});
