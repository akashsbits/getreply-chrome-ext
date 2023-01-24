const mutationObserver = (selector, elmHandler) => {
  // Execute the cb when DOM changes occur
  return new MutationObserver((mutations_list) => {
    mutations_list.forEach((mutation) => {
      const addedNodes = mutation.addedNodes;
      addedNodes.forEach((added_node) => {
        if (added_node.querySelector) {
          const el = added_node.querySelector(selector);

          if (el != null) {
            elmHandler(el);
          }
        }
      });
    });
  });
};

const getTextbox = (el) => {
  const inputEl = el.querySelector(
    'div[data-testid^="tweetTextarea_"][role="textbox"]'
  );
  if (inputEl) {
    return inputEl;
  }
  if (!el.parentElement) {
    return null;
  } else {
    return getTextbox(el.parentElement);
  }
};

const addAIButtons = (elm) => {
  const el = elm.parentElement;

  const btn1 = document.createElement("button");
  btn1.textContent = "🙂 Agree";
  const btn2 = document.createElement("button");
  btn2.textContent = "🔥 Joke";
  const btn3 = document.createElement("button");
  btn3.textContent = "💡 Idea";
  const btn4 = document.createElement("button");
  btn4.textContent = "👎 Disagree";
  const btn5 = document.createElement("button");
  btn5.textContent = "❓ Question";

  const div = document.createElement("div");
  div.setAttribute("id", "ai-buttons");
  div.appendChild(btn1);
  div.appendChild(btn2);
  div.appendChild(btn3);
  div.appendChild(btn4);
  div.appendChild(btn5);

  for (const child of div.children) {
    child.onclick = async () => {
      console.log(getTextbox(elm).textContent);
      //   const text = await getContent();
    };
  }

  el.prepend(div);
};

const getContent = () => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "generate_tweet" }, (response) =>
      resolve(response)
    );
  });
};

const toolbarElm = mutationObserver('div[data-testid="toolBar"]', addAIButtons);
const rootElm = document.querySelector("#react-root");
toolbarElm.observe(rootElm, { subtree: true, childList: true });
