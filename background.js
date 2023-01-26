chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const url = "http://localhost:3000/";
  const prompt = { prompt: message };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  })
    .then((response) => response.json())
    .then((data) => sendResponse(data))
    .catch((err) => console.log(err));

  return true;
});
