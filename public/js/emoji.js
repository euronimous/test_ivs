const endpoints = {
  // metadata: `https://h1r3ebcb0g.execute-api.us-west-2.amazonaws.com/metadata?channelArn=${channelArn}`
};

 $(function () {
const emojiContainer = document.querySelector(".overlay");
const clientId = `${Math.random()
  .toString()
  .slice(2)}${Math.random().toString().slice(2)}`;
const ICON_REMOVE_TIME = 2000;
const ICON_FADE_START_TIME = 1000;
const iconTypeMap = {
  star: "🌟",
  "100": "💯",
  clap: "👏",
  tada: "🎉",
  laugh: "😂"
};
let selectedEmoji = "clap";

main();


function handleAddEmoji(event) {
  const bounds = emojiContainer.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const icon = { x: x, y: y, type: selectedEmoji, senderId: clientId };
  renderIcon(icon);
  notifyStream(icon);
}

function handleEmojiToggle(event) {
  const id = event.target.getAttribute("data-id");
  if (!id) {
    return;
  }

  selectedEmoji = id;
  updateEmojiSelection();
}
function handleEmojiToggle(event) {
  const id = event.target.getAttribute("data-id");
  if (!id) {
    return;
  }

  selectedEmoji = id;
  updateEmojiSelection();
}

function renderIcon(icon) {
  const iconEl = document.createElement("div");
  iconEl.classList.add("icon");
  iconEl.innerText = iconTypeMap[icon.type];
  iconEl.style.top = `calc(${icon.y * 100}% - 18px)`;
  iconEl.style.left = `calc(${icon.x * 100}% - 18px)`;
  emojiContainer.append(iconEl);

  setTimeout(() => {
    iconEl.classList.add("fade");
  }, ICON_FADE_START_TIME);
  setTimeout(() => {
    iconEl.remove();
  }, ICON_REMOVE_TIME);
}

function notifyStream(icon) {
  const url = endpoints.metadata;
  fetch(url, { method: "POST", body: JSON.stringify(icon) });
}

function updateEmojiSelection() {
  clearActiveSelection();
  const el = document.querySelector(`[data-id="${selectedEmoji}"].emoji-btn`);
  if (!el) {
    console.error(`Invalid emoji ${selectedEmoji} not found`);
  } else {
    el.classList.add("active");
  }
}

function clearActiveSelection() {
  [].forEach.call(document.getElementsByClassName("emoji-btn"), function (el) {
    el.classList.remove("active");
  });
}

function main() {
  emojiContainer.addEventListener("click", handleAddEmoji);
  document
    .querySelector(".emoji-picker")
    .addEventListener("click", handleEmojiToggle);
  updateEmojiSelection();
}

 });