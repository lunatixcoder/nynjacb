/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// WebRTC support -- Note that this relies on parts of the interface code that usually goes in ui.js

define(["require", "jquery", "util", "session", "ui", "peers", "storage", "windowing"], function (require, $, util, session, ui, peers, storage, windowing) {
  var webrtc = util.Module("webrtc");
  var assert = util.assert;

  session.RTCSupported = !!(window.mozRTCPeerConnection ||
                            window.webkitRTCPeerConnection ||
                            window.RTCPeerConnection);

  if (session.RTCSupported && $.browser.mozilla && parseInt($.browser.version, 10) <= 19) {
    // In a few versions of Firefox (18 and 19) these APIs are present but
    // not actually usable
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=828839
    // Because they could be pref'd on we'll do a quick check:
    try {
      (function () {
        var conn = new window.mozRTCPeerConnection();
      })();
    } catch (e) {
      session.RTCSupported = false;
    }
  }

  var mediaConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: false
    }
  };
  if (window.mozRTCPeerConnection) {
    mediaConstraints.mandatory.MozDontOfferDataChannel = true;
  }

  var URL = window.webkitURL || window.URL;
  var RTCSessionDescription = window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.RTCSessionDescription;
  var RTCIceCandidate = window.mozRTCIceCandidate || window.webkitRTCIceCandidate || window.RTCIceCandidate;

  function makePeerConnection() {
    // Based roughly off: https://github.com/firebase/gupshup/blob/gh-pages/js/chat.js
    if (window.webkitRTCPeerConnection) {
      return new webkitRTCPeerConnection({
        "iceServers": [{"url": "stun:stun.l.google.com:19302"}]
      }, {
        "optional": [{"DtlsSrtpKeyAgreement": true}]
      });
    }
    if (window.mozRTCPeerConnection) {
      return new mozRTCPeerConnection({
        // Or stun:124.124.124..2 ?
        "iceServers": [{"url": "stun:23.21.150.121"}]
      }, {
        "optional": []
      });
    }
    throw new util.AssertionError("Called makePeerConnection() without supported connection");
  }

  function ensureCryptoLine(sdp) {
    if (! window.mozRTCPeerConnection) {
      return sdp;
    }

    var sdpLinesIn = sdp.split('\r\n');
    var sdpLinesOut = [];

    // Search for m line.
    for (var i = 0; i < sdpLinesIn.length; i++) {
      sdpLinesOut.push(sdpLinesIn[i]);
      if (sdpLinesIn[i].search('m=') !== -1) {
        sdpLinesOut.push("a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      }
    }

    sdp = sdpLinesOut.join('\r\n');
    return sdp;
  }

  function getUserMedia(options, success, failure) {
    failure = failure || function (error) {
      console.error("Error in getUserMedia:", error);
    };
    (navigator.getUserMedia ||
     navigator.mozGetUserMedia ||
     navigator.webkitGetUserMedia ||
     navigator.msGetUserMedia).call(navigator, options, success, failure);
  }

  /****************************************
   * getUserMedia Avatar support
   */

  session.on("ui-ready", function () {
    $("#nynjacb-self-avatar").click(function () {
      var avatar = peers.Self.avatar;
      if (avatar) {
        $preview.attr("src", avatar);
      }
      ui.displayToggle("#nynjacb-avatar-edit");
    });
    if (! session.RTCSupported) {
      $("#nynjacb-avatar-edit-rtc").hide();
    }

    var avatarData = null;
    var $preview = $("#nynjacb-self-avatar-preview");
    var $accept = $("#nynjacb-self-avatar-accept");
    var $cancel = $("#nynjacb-self-avatar-cancel");
    var $takePic = $("#nynjacb-avatar-use-camera");
    var $video = $("#nynjacb-avatar-video");
    var $upload = $("#nynjacb-avatar-upload");

    $takePic.click(function () {
      if (! streaming) {
        startStreaming();
        return;
      }
      takePicture();
    });

    function savePicture(dataUrl) {
      avatarData = dataUrl;
      $preview.attr("src", avatarData);
      $accept.attr("disabled", null);
    }

    $accept.click(function () {
      peers.Self.update({avatar:  avatarData});
      ui.displayToggle("#nynjacb-no-avatar-edit");
      // FIXME: these probably shouldn't be two elements:
      $("#nynjacb-participants-other").show();
      $accept.attr("disabled", "1");
    });

    $cancel.click(function () {
      ui.displayToggle("#nynjacb-no-avatar-edit");
      // FIXME: like above:
      $("#nynjacb-participants-other").show();
    });

    var streaming = false;
    function startStreaming() {
      getUserMedia({
          video: true,
          audio: false
        },
        function(stream) {
          streaming = true;
          $video[0].src = URL.createObjectURL(stream);
          $video[0].play();
        },
        function(err) {
          // FIXME: should pop up help or something in the case of a user
          // cancel
          console.error("getUserMedia error:", err);
        }
      );
    }

    function takePicture() {
      assert(streaming);
      var height = $video[0].videoHeight;
      var width = $video[0].videoWidth;
      width = width * (session.AVATAR_SIZE / height);
      height = session.AVATAR_SIZE;
      var $canvas = $("<canvas>");
      $canvas[0].height = session.AVATAR_SIZE;
      $canvas[0].width = session.AVATAR_SIZE;
      var context = $canvas[0].getContext("2d");
      context.arc(session.AVATAR_SIZE/2, session.AVATAR_SIZE/2, session.AVATAR_SIZE/2, 0, Math.PI*2);
      context.closePath();
      context.clip();
      context.drawImage($video[0], (session.AVATAR_SIZE - width) / 2, 0, width, height);
      savePicture($canvas[0].toDataURL("image/png"));
    }

    $upload.on("change", function () {
      var reader = new FileReader();
      reader.onload = function () {
        // FIXME: I don't actually know it's JPEG, but it's probably a
        // good enough guess:
        var url = "data:image/jpeg;base64," + util.blobToBase64(this.result);
        convertImage(url, function (result) {
          savePicture(result);
        });
      };
      reader.onerror = function () {
        console.error("Error reading file:", this.error);
      };
      reader.readAsArrayBuffer(this.files[0]);
    });

    function convertImage(imageUrl, callback) {
      var $canvas = $("<canvas>");
      $canvas[0].height = session.AVATAR_SIZE;
      $canvas[0].width = session.AVATAR_SIZE;
      var context = $canvas[0].getContext("2d");
      var img = new Image();
      img.src = imageUrl;
      // Sometimes the DOM updates immediately to call
      // naturalWidth/etc, and sometimes it doesn't; using setTimeout
      // gives it a chance to catch up
      setTimeout(function () {
        var width = img.naturalWidth || img.width;
        var height = img.naturalHeight || img.height;
        width = width * (session.AVATAR_SIZE / height);
        height = session.AVATAR_SIZE;
        context.drawImage(img, 0, 0, width, height);
        callback($canvas[0].toDataURL("image/png"));
      });
    }

  });

  /****************************************
   * RTC support
   */

  function audioButton(selector) {
    ui.displayToggle(selector);
    if (selector == "#nynjacb-audio-incoming") {
      $("#nynjacb-audio-button").addClass("nynjacb-animated").addClass("nynjacb-color-alert");
    } else {
      $("#nynjacb-audio-button").removeClass("nynjacb-animated").removeClass("nynjacb-color-alert");
    }
  }

  session.on("ui-ready", function () {
    $("#nynjacb-audio-button").click(function () {
      if ($("#nynjacb-rtc-info").is(":visible")) {
        windowing.hide();
        return;
      }
      if (session.RTCSupported) {
        enableAudio();
      } else {
        windowing.show("#nynjacb-rtc-not-supported");
      }
    });

    if (! session.RTCSupported) {
      audioButton("#nynjacb-audio-unavailable");
      return;
    }
    audioButton("#nynjacb-audio-ready");

    var audioStream = null;
    var accepted = false;
    var connected = false;
    var $audio = $("#nynjacb-audio-element");
    var offerSent = null;
    var offerReceived = null;
    var offerDescription = false;
    var answerSent = null;
    var answerReceived = null;
    var answerDescription = false;
    var _connection = null;
    var iceCandidate = null;

    function enableAudio() {
      accepted = true;
      storage.settings.get("dontShowRtcInfo").then(function (dontShow) {
        if (! dontShow) {
          windowing.show("#nynjacb-rtc-info");
        }
      });
      if (! audioStream) {
        startStreaming(connect);
        return;
      }
      if (! connected) {
        connect();
      }
      toggleMute();
    }

    ui.container.find("#nynjacb-rtc-info .nynjacb-dont-show-again").change(function () {
      storage.settings.set("dontShowRtcInfo", this.checked);
    });

    function error() {
      console.warn.apply(console, arguments);
      var s = "";
      for (var i=0; i<arguments.length; i++) {
        if (s) {
          s += " ";
        }
        var a = arguments[i];
        if (typeof a == "string") {
          s += a;
        } else {
          var repl;
          try {
            repl = JSON.stringify(a);
          } catch (e) {
          }
          if (! repl) {
            repl = "" + a;
          }
          s += repl;
        }
      }
      audioButton("#nynjacb-audio-error");
      // FIXME: this title doesn't seem to display?
      $("#nynjacb-audio-error").attr("title", s);
    }

    function startStreaming(callback) {
      getUserMedia(
        {
          video: false,
          audio: true
        },
        function (stream) {
          audioStream = stream;
          attachMedia("#nynjacb-local-audio", stream);
          if (callback) {
            callback();
          }
        },
        function (err) {
          // FIXME: handle cancel case
          if (err && err.code == 1) {
            // User cancel
            return;
          }
          error("getUserMedia error:", err);
        }
      );
    }

    function attachMedia(element, media) {
      element = $(element)[0];
      console.log("Attaching", media, "to", element);
      if (window.mozRTCPeerConnection) {
        element.mozSrcObject = media;
        element.play();
      } else {
        element.autoplay = true;
        element.src = URL.createObjectURL(media);
      }
    }

    function getConnection() {
      assert(audioStream);
      if (_connection) {
        return _connection;
      }
      try {
        _connection = makePeerConnection();
      } catch (e) {
        error("Error creating PeerConnection:", e);
        throw e;
      }
      _connection.onaddstream = function (event) {
        console.log("got event", event, event.type);
        attachMedia($audio, event.stream);
        audioButton("#nynjacb-audio-active");
      };
      _connection.onstatechange = function () {
        // FIXME: this doesn't seem to work:
        // Actually just doesn't work on Firefox
        console.log("state change", _connection.readyState);
        if (_connection.readyState == "closed") {
          audioButton("#nynjacb-audio-ready");
        }
      };
      _connection.onicecandidate = function (event) {
        if (event.candidate) {
          session.send({
            type: "rtc-ice-candidate",
            candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid,
              candidate: event.candidate.candidate
            }
          });
        }
      };
      _connection.addStream(audioStream);
      return _connection;
    }

    function addIceCandidate() {
      if (iceCandidate) {
        console.log("adding ice", iceCandidate);
        _connection.addIceCandidate(new RTCIceCandidate(iceCandidate));
      }
    }

    function connect() {
      var connection = getConnection();
      if (offerReceived && (! offerDescription)) {
        connection.setRemoteDescription(
          new RTCSessionDescription({
            type: "offer",
            sdp: offerReceived
          }),
          function () {
            offerDescription = true;
            addIceCandidate();
            connect();
          },
          function (err) {
            error("Error doing RTC setRemoteDescription:", err);
          }
        );
        return;
      }
      if (! (offerSent || offerReceived)) {
        connection.createOffer(function (offer) {
          console.log("made offer", offer);
          offer.sdp = ensureCryptoLine(offer.sdp);
          connection.setLocalDescription(
            offer,
            function () {
              session.send({
                type: "rtc-offer",
                offer: offer.sdp
              });
              offerSent = offer;
              audioButton("#nynjacb-audio-outgoing");
            },
            function (err) {
              error("Error doing RTC setLocalDescription:", err);
            },
            mediaConstraints
          );
        }, function (err) {
          error("Error doing RTC createOffer:", err);
        });
      } else if (! (answerSent || answerReceived)) {
        // FIXME: I might have only needed this due to my own bugs, this might
        // not actually time out
        var timeout = setTimeout(function () {
          if (! answerSent) {
            error("createAnswer Timed out; reload or restart browser");
          }
        }, 2000);
        connection.createAnswer(function (answer) {
          answer.sdp = ensureCryptoLine(answer.sdp);
          clearTimeout(timeout);
          connection.setLocalDescription(
            answer,
            function () {
              session.send({
                type: "rtc-answer",
                answer: answer.sdp
              });
              answerSent = answer;
            },
            function (err) {
              clearTimeout(timeout);
              error("Error doing RTC setLocalDescription:", err);
            },
            mediaConstraints
          );
        }, function (err) {
          error("Error doing RTC createAnswer:", err);
        });
      }
    }

    function toggleMute() {
      // FIXME: implement.  Actually, wait for this to be implementable - currently
      // muting of localStreams isn't possible
      // FIXME: replace with hang-up?
    }

    session.hub.on("rtc-offer", function (msg) {
      if (offerReceived || answerSent || answerReceived || offerSent) {
        abort();
      }
      offerReceived = msg.offer;
      if (! accepted) {
        audioButton("#nynjacb-audio-incoming");
        return;
      }
      function run() {
        var connection = getConnection();
        connection.setRemoteDescription(
          new RTCSessionDescription({
            type: "offer",
            sdp: offerReceived
          }),
          function () {
            offerDescription = true;
            addIceCandidate();
            connect();
          },
          function (err) {
            error("Error doing RTC setRemoteDescription:", err);
          }
        );
      }
      if (! audioStream) {
        startStreaming(run);
      } else {
        run();
      }
    });

    session.hub.on("rtc-answer", function (msg) {
      if (answerSent || answerReceived || offerReceived || (! offerSent)) {
        abort();
        // Basically we have to abort and try again.  We'll expect the other
        // client to restart when appropriate
        session.send({type: "rtc-abort"});
        return;
      }
      answerReceived = msg.answer;
      assert(offerSent);
      assert(audioStream);
      var connection = getConnection();
      connection.setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp: answerReceived
        }),
        function () {
          answerDescription = true;
          // FIXME: I don't think this connect is ever needed?
          connect();
        },
        function (err) {
          error("Error doing RTC setRemoteDescription:", err);
        }
      );
    });

    session.hub.on("rtc-ice-candidate", function (msg) {
      iceCandidate = msg.candidate;
      if (offerDescription || answerDescription) {
        addIceCandidate();
      }
    });

    session.hub.on("rtc-abort", function (msg) {
      abort();
      if (! accepted) {
        return;
      }
      if (! audioStream) {
        startStreaming(function () {
          connect();
        });
      } else {
        connect();
      }
    });

    session.hub.on("hello", function (msg) {
      // FIXME: displayToggle should be set due to
      // _connection.onstatechange, but that's not working, so
      // instead:
      audioButton("#nynjacb-audio-ready");
      if (accepted && (offerSent || answerSent)) {
        abort();
        connect();
      }
    });

    function abort() {
      answerSent = answerReceived = offerSent = offerReceived = null;
      answerDescription = offerDescription = false;
      _connection = null;
      $audio[0].removeAttribute("src");
    }

  });

  return webrtc;

});
