// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as config from '../../config';

class VideoPlayer extends Component {
  constructor() {
    super ();
    this.state = {
      maxMetaData: 10,
      metaData: [],
    }
  }

  componentDidMount() {
    const mediaPlayerScript = document.createElement("script");
    mediaPlayerScript.src = "https://player.live-video.net/1.1.2/amazon-ivs-player.min.js";
    mediaPlayerScript.async = true;
    mediaPlayerScript.onload = () => this.mediaPlayerScriptLoaded();
    document.body.appendChild(mediaPlayerScript);
  }

  mediaPlayerScriptLoaded = () => {
    // This shows how to include the Amazon IVS Player with a script tag from our CDN
    // If self hosting, you may not be able to use the create() method since it requires
    // that file names do not change and are all hosted from the same directory.

    const MediaPlayerPackage = window.IVSPlayer;

    // First, check if the browser supports the Amazon IVS player.
    if (!MediaPlayerPackage.isPlayerSupported) {
        console.warn("The current browser does not support the Amazon IVS player.");
        return;
    }

    const PlayerState = MediaPlayerPackage.PlayerState;
    const PlayerEventType = MediaPlayerPackage.PlayerEventType;

    // Initialize player
    const player = MediaPlayerPackage.create();
    player.attachHTMLVideoElement(document.getElementById("video-player"));

    // Attach event listeners
    player.addEventListener(PlayerState.PLAYING, () => {
        console.log("Player State - PLAYING");
    });
    player.addEventListener(PlayerState.ENDED, () => {
        console.log("Player State - ENDED");
    });
    player.addEventListener(PlayerState.READY, () => {
        console.log("Player State - READY");
    });
    player.addEventListener(PlayerEventType.ERROR, (err) => {
        console.warn("Player Event - ERROR:", err);
    });
    player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {
        const metadataText = cue.text;
        const position = player.getPosition().toFixed(2);
        console.log(
          `PlayerEvent - METADATA: "${metadataText}". Observed ${position}s after playback started.`
        );
        this.prop.triggerQuiz(metadataText);
    });

    // Setup stream and play
    player.setAutoplay(true);
    player.load(config.PLAYBACK_URL);
    player.setVolume(0.5);
  }



  render() {
    return (
    <React.Fragment>
      <div className="player-wrapper">
        <div className="aspect-169 pos-relative full-width full-height">
          <div class="overlay"></div>
          <video id="video-player" className="video-elem pos-absolute full-width" playsInline muted></video>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

VideoPlayer.propTypes = {
  setMetadataId: PropTypes.func,
  triggerQuiz: PropTypes.func,
  videoStream: PropTypes.string,
};

export default VideoPlayer;
