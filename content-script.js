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

const checkDomain = (domain) => {
  const str = window.location.hostname;
  return str.includes(domain);
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

const getPrompt = (reaction, content, promptFor) => {
  switch (promptFor) {
    case "twitter":
      return `Give a ${reaction} reply for this tweet ${content}`;
    case "linkedin":
      return `Giva a ${reaction} reply for this post ${content}`;
    /* Gmail */
  }
};

const createButtons = (el, contentSelector, textboxSelector, promptFor) => {
  const div = document.createElement("div");
  div.setAttribute("id", "getreply_buttons");

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

const addTwitterButtons = (el) => {
  const twitterTextboxSel =
    'div[data-testid^="tweetTextarea_"][role="textbox"]';
  const tweetSel = 'div[data-testid="tweetText"]';
  const twitterBtnsParentSel = 'div[data-testid="toolBar"]';

  const buttons = createButtons(el, tweetSel, twitterTextboxSel, "twitter");

  if (buttons != null) {
    const _el = getElement(el, twitterBtnsParentSel).parentElement;
    _el.prepend(buttons);
  }
};

const addLinkedinButtons = (el) => {
  const linkedinPostSel = "div.feed-shared-update-v2__description-wrapper";
  const linkedinBtnsParentSel = "form.comments-comment-box__form";
  const linkedinTextboxSel =
    'div[data-test-ql-editor-contenteditable="true"][role="textbox"]';

  const _buttons = createButtons(
    el,
    linkedinPostSel,
    linkedinTextboxSel,
    "linkedin"
  );

  if (_buttons != null) {
    const _el = getElement(el, linkedinBtnsParentSel).parentElement;
    _el.appendChild(_buttons);
  }
};

const getReply = (prompt) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(prompt, (response) => resolve(response));
  });
};

if (checkDomain("twitter")) {
  const watchEl = mutationObserver(
    'div[data-testid="tweetButton"]',
    addTwitterButtons
  );
  const reactRootEl = document.querySelector("#react-root");
  watchEl.observe(reactRootEl, { subtree: true, childList: true });
}

if (checkDomain("linkedin")) {
  const watchEl = mutationObserver(
    "div.comments-comment-box__form-container",
    addLinkedinButtons
  );
  const linkedinRootEl = document.querySelector(".application-outlet");
  watchEl.observe(linkedinRootEl, { subtree: true, childList: true });
}
