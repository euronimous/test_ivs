import React, {Component } from 'react';

class Emoji extends Component {

 constructor() {
    super ();
    this.state = {

     }

     this.ICON_REMOVE_TIME = 2000;
     this.ICON_FADE_START_TIME = 1000;
     this.iconTypeMap = {
         star: "🌟",
         "100": "💯",
         clap: "👏",
         tada: "🎉",
         laugh: "😂"
       };
     this. selectedEmoji = "clap";
     this.clientId = `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;
     this.endpoints = {
         // metadata: `https://h1r3ebcb0g.execute-api.us-west-2.amazonaws.com/metadata?channelArn=${channelArn}`
       };

     this.emojiContainer =document.querySelector(".overlay");

    }

 componentDidMount() {
    this.emojiContainer =document.querySelector(".overlay");
    this.emojiContainer.addEventListener("click", (event) => {
            this.handleAddEmoji(event);
        });
      document.querySelector(".emoji-picker").addEventListener("click",  (event) => {
            this.handleEmojiToggle(event);
        });
      this.updateEmojiSelection();
  }

   handleAddEmoji = (event) => {
    var bounds = this.emojiContainer.getBoundingClientRect();
    var x = (event.clientX - bounds.left) / bounds.width;
    var y = (event.clientY - bounds.top) / bounds.height;
    var icon = { x: x, y: y, type: this.selectedEmoji, senderId: this.clientId };
    this.renderIcon(icon);
    this.notifyStream(icon);
  }

   handleEmojiToggle = (event) => {
    var id = event.target.getAttribute("data-id");
    if (!id) {
      return;
    }

    this.selectedEmoji = id;
    this.updateEmojiSelection();
  }

   renderIcon = (icon) => {
    const iconEl = document.createElement("div");
    iconEl.classList.add("icon");
    iconEl.innerText =this.iconTypeMap[icon.type];
    iconEl.style.top = `calc(${icon.y * 100}% - 18px)`;
    iconEl.style.left = `calc(${icon.x * 100}% - 18px)`;
    this.emojiContainer.append(iconEl);

    setTimeout(() => {
      iconEl.classList.add("fade");
    }, this.ICON_FADE_START_TIME);
    setTimeout(() => {
      iconEl.remove();
    }, this.ICON_REMOVE_TIME);
  };

    notifyStream = (icon) => {
      const url = this.endpoints.metadata;
      fetch(url, { method: "POST", body: JSON.stringify(icon) });
    };

    updateEmojiSelection = () => {
      this.clearActiveSelection();
      const el = document.querySelector(`[data-id="${this.selectedEmoji}"].emoji-btn`);
      if (!el) {
        console.error('Invalid emoji ${selectedEmoji} not found');
      } else {
        el.classList.add("active");
      }
    };

    clearActiveSelection = () => {
      [].forEach.call(document.getElementsByClassName("emoji-btn"), function (el) {
        el.classList.remove("active");
      });
    };

    render() {
        return (
            <div class="emoji-picker">
                          <ul class="emojis">
                              <li><button class="emoji-btn" data-id="star"> 🌟 </button></li>
                              <li><button class="emoji-btn" data-id="100"> 💯 </button></li>
                              <li><button class="emoji-btn active" data-id="clap"> 👏 </button></li>
                              <li><button class="emoji-btn" data-id="tada"> 🎉 </button></li>
                              <li><button class="emoji-btn" data-id="laugh"> 😂 </button></li>
                          </ul>
             </div>
      )
    }

}

export default Emoji;
