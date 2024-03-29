/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This module handles all the different UI that happens (sometimes in order) when
   NynjaCB is started:

   - Introduce the session when you've been invited
   - Show any browser compatibility indicators
   - Show the walkthrough the first time
   - Show the share link window

   When everything is done it fires session.emit("startup-ready")

*/
define(["util", "require", "jquery", "windowing", "storage"], function (util, require, $, windowing, storage) {
  var assert = util.assert;
  var startup = util.Module("startup");
  // Avoid circular import:
  var session = null;

  var STEPS = [
    "browserBroken",
    "browserUnsupported",
    "sessionIntro",
    "walkthrough",
    // Look in the share() below if you add anything after here:
    "share"
    ];

  var currentStep = null;

  startup.start = function () {
    if (! session) {
      require(["session"], function (sessionModule) {
        session = sessionModule;
        startup.start();
      });
      return;
    }
    var index = -1;
    if (currentStep) {
      index = STEPS.indexOf(currentStep);
    }
    index++;
    if (index >= STEPS.length) {
      session.emit("startup-ready");
      return;
    }
    currentStep = STEPS[index];
    handlers[currentStep](startup.start);
  };

  var handlers = {

    browserBroken: function (next) {
      if (window.WebSocket) {
        next();
        return;
      }
      windowing.show("#nynjacb-browser-broken", {
        onClose: function () {
          session.close();
        }
      });
      if ($.browser.msie) {
        $("#nynjacb-browser-broken-is-ie").show();
      }
    },

    browserUnsupported: function (next) {
        next();
    },

    sessionIntro: function (next) {
      if ((! session.isClient) || ! session.firstRun) {
        next();
        return;
      }
      NynjaCB.config.close("suppressJoinConfirmation");
      if (NynjaCB.config.get("suppressJoinConfirmation")) {
        next();
        return;
      }
      var cancelled = false;
      windowing.show("#nynjacb-intro", {
        onClose: function () {
          if (! cancelled) {
            next();
          }
        }
      });
      $("#nynjacb-intro .nynjacb-modal-dont-join").click(function () {
        cancelled = true;
        windowing.hide();
        session.close("declined-join");
      });
    },

    walkthrough: function (next) {
      storage.settings.get("seenIntroDialog").then(function (seenIntroDialog) {
        if (seenIntroDialog) {
          next();
          return;
        }
        require(["walkthrough"], function (walkthrough) {
          walkthrough.start(true, function () {
            storage.settings.set("seenIntroDialog", true);
            next();
          });
        });
      });
    },

    share: function (next) {
      NynjaCB.config.close("suppressInvite");
      if (session.isClient || (! session.firstRun) ||
          nynjacb.config.get("suppressInvite")) {
        next();
        return;
      }
      require(["windowing"], function (windowing) {
        windowing.show("#NynjaCB-share");
        // FIXME: no way to detect when the window is closed
        // If there was a next() step then it would not work
      });
    }

  };

  return startup;
});
