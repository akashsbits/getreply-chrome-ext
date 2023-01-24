chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Test api
  const apiCall =
    "http://13.233.251.202/wallet/2e272c3f-05d1-4f65-9daf-9106bce286b3/transaction";

  fetch(apiCall)
    .then((response) => response.json())
    .then((data) => sendResponse(data))
    .catch((err) => console.log(err));

  return true;
});
