// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from 'react';
import * as config from '../../config.js';
import io from 'socket.io-client';

// Components
import VideoPlayer from '../videoPlayer/VideoPlayer.jsx';
import SignIn from './SignIn.jsx';
import Emoji from '../emoji/Emoji.jsx';

class Chat extends Component {
  constructor() {
    super ();
    this.state = {
      metadataId: null,
      showSignIn: false,
      username: '',
      message: '',
      messages: [],
      connection: null
    }
    this.chatRef = React.createRef();
    this.messagesEndRef = React.createRef();
  }

  componentDidMount() {
    const connection = io.connect();;

    connection.on('connect', () => {
       console.log("WebSocket is now open.");
    });

    connection.on('disconnect', () => {
           console.log("WebSocket is now closed.");
     });

     connection.on('error', (error) => {
       console.error("WebSocket error observed:", error);
     });


     connection.on('messageReceived', (event) => {
                 // append received message from the server to the DOM element
                 const messages = this.state.messages;
                 const data = event.split('::');
                 const username = data[0];
                 const message = data.slice(1).join('::'); // in case the message contains the separator '::'

                 messages.push({
                   timestamp: Date.now(),
                   username,
                   message
                 });

                 this.setState({ messages });
         });

    this.setState({ connection });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  updateUsername = username => {
  const { connection } = this.state;
    connection.emit('join', username, (username) => {
    });
    this.setState({ username, showSignIn: false }, () => this.chatRef.current.focus());
  }



    // Remove card
    removeCard = () => {
      quizEl.classList.toggle("drop");
    }

    // Trigger quiz
    triggerQuiz = (metadataText) => {
      let obj = JSON.parse(metadataText);

      quizEl.style.display = "";
      quizEl.classList.remove("drop");
      waitMessage.style.display = "none";
      cardInnerEl.style.display = "none";
      cardInnerEl.style.pointerEvents = "auto";

      while (answersEl.firstChild) answersEl.removeChild(answersEl.firstChild);
      questionEl.textContent = obj.question;

      let createAnswers = function (obj, i) {
        let q = document.createElement("a");
        let qText = document.createTextNode(obj.answers[i]);
        answersEl.appendChild(q);
        q.classList.add("answer");
        q.appendChild(qText);

        q.addEventListener("click", (event) => {
          cardInnerEl.style.pointerEvents = "none";
          if (q.textContent === obj.answers[obj.correctIndex]) {
            q.classList.toggle("correct");
          } else {
            q.classList.toggle("wrong");
          }
          setTimeout(function () {
            this.removeCard();
            waitMessage.style.display = "";
          }, 1050);
          return false;
        });
      };

      for (var i = 0; i < Object.keys(obj.answers).length; i++) {
        createAnswers(obj, i);
      }
      cardInnerEl.style.display = "";
    }

  handleOnClick = () => {
    const { username } = this.state;
    if (!username) {
      this.setState({ showSignIn: true });
    }
  }

  handleChange = e => {
    this.setState({ message: e.target.value })
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) { // keyCode 13 is carriage return
      const { username, message, connection } = this.state;
      if (message) {
        const data = ` "${username}::${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" `;


        connection.emit('sendmessage', data, () => {

            });

        this.setState({ message: '' });
      }
    }
  }

  parseUrls = (userInput) => {
    var urlRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;
    let formattedMessage = userInput.replace(urlRegExp, (match) => {
      let formattedMatch = match;
      if (!match.startsWith('http')) {
        formattedMatch = `http://${match}`;
      }
      return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    return formattedMessage;
  }

  renderMessages = () => {
    const { messages } = this.state;
    return (
      messages.map(message => {
        let formattedMessage = this.parseUrls(message.message);
        return (
          <div className="chat-line" key={message.timestamp}>
            <p><span className="username">{message.username}</span><span dangerouslySetInnerHTML={{__html: formattedMessage}} /></p>
          </div>
        )
      })
    )
  }

  setMetadataId = (metadataId) => {
    this.setState({ metadataId });
  }

  render() {
    const { username, message, showSignIn } = this.state;
    return (
      <React.Fragment>
        <header>
          <h1>Simple Live Chat demo</h1>
        </header>
        <div>
        <div className="main full-width full-height chat-container">
          <div className="content-wrapper mg-2">
          <VideoPlayer setMetadataId={this.setMetadataId} videoStream={config.PLAYBACK_URL} triggerQuiz={this.triggerQuiz} />
            <div className="col-wrapper">
              <div className="chat-wrapper pos-absolute pd-t-1 top-0 bottom-0">
                <div className="messages">
                  {this.renderMessages()}
                  <div ref={this.messagesEndRef} />
                </div>
                <div className="composer">
                  <input
                    ref={this.chatRef}
                    className={`rounded ${!username ? 'hidden' : ''}`}
                    type="text"
                    placeholder="Say something"
                    value={message}
                    maxLength={510}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                  />
                  {!username && (
                    <fieldset>
                      <button onClick={this.handleOnClick} className="btn btn--primary full-width rounded">Click to send messages</button>
                    </fieldset>
                  )}
                </div>
              </div>
            </div>

          </div>
          {showSignIn &&
            <SignIn updateUsername={this.updateUsername} />
          }
        </div>
        <Emoji />
         <div class="quiz-wrap">
              <div id="waiting"><span class="waiting-text float">Waiting for the next question</span></div>
              <div id="quiz" class="card drop">
                  <div id="card-inner">
                      <h2 id="question"></h2>
                      <div id="answers"></div>
                  </div>
              </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Chat;
