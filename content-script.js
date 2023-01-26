const reactions = [
  { reaction: "🙂", type: "Agree" },
  { reaction: "🔥", type: "Joke" },
  { reaction: "💡", type: "Idea" },
  { reaction: "👎", type: "Disagree" },
  { reaction: "❓", type: "Question" },
  // add more reactions...
];

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

const getElement = (el, selector) => {
  const _el = el.querySelector(selector);

  if (_el) {
    return _el;
  }
  if (!el.parentElement) {
    return null;
  } else {
    return getElement(el.parentElement, selector);
  }
};

const insertText = (el, text) => {
  el.focus();
  // Need to change: execCommand deprecated
  document.execCommand("insertText", false, text.trim());
};

const getPrompt = (reaction, tweet, promptFor) => {
  switch (promptFor) {
    case "twitter":
      return `Give a ${reaction} reply for this tweet ${tweet}`;
    /* Linkedin */
    /* Gmail */
  }
};

const createButtons = (el, contentSelector, textboxSelector, promptFor) => {
  const div = document.createElement("div");
  div.setAttribute("id", "ai-buttons");

  for (let i = 0; i < reactions.length; i++) {
    const { reaction, type } = reactions[i];
    const btn = document.createElement("button");
    btn.textContent = `${reaction} ${type}`;

    btn.onclick = async () => {
      const reaction = type;
      const textbox = getElement(el, textboxSelector);
      const content = getElement(el, contentSelector).textContent;
      const prompt = getPrompt(reaction, content, promptFor);
      const text = await getReply(prompt);

      if (text) insertText(textbox, text.reply);
    };

    div.appendChild(btn);
  }

  return div;
};

const addButtons = (el) => {
  /* Twitter */
  const twitterTextboxSel =
    'div[data-testid^="tweetTextarea_"][role="textbox"]';
  const tweetSel = 'div[data-testid="tweetText"]';
  const twitterBtnsParentSel = 'div[data-testid="toolBar"]';

  const buttons = createButtons(el, tweetSel, twitterTextboxSel, "twitter");

  if (buttons) {
    const _el = getElement(el, twitterBtnsParentSel).parentElement;
    _el.prepend(buttons);
  }

  /* Linkedin */
  /*************/
  /*************/

  /* Gmail */
  /*************/
  /*************/
};

const getReply = (prompt) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(prompt, (response) => resolve(response));
  });
};

const watchEl = mutationObserver('div[data-testid="tweetButton"]', addButtons);
const reactRootEl = document.querySelector("#react-root");
watchEl.observe(reactRootEl, { subtree: true, childList: true });
