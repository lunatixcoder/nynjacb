/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

define([], function () {
  return {
    "interface": "nynjacb<% /*\n   This is basically all the markup and interface for NynjaCB.\n   Note all links should be like http://localhost:8080/nynjacb/*\n   these links are rewritten with the location where NynjaCB was deployed.\n\n   This file is inlined into nynjacb/templates.js\n*/ %>\n<div id=\"nynjacb-container\" class=\"nynjacb\">\n\n  <!-- This is the main set of buttons: -->\n  <div id=\"nynjacb-dock\" class=\"nynjacb-dock-right\">\n    <div id=\"nynjacb-dock-anchor\" title=\"Move the dock\">\n      <span id=\"nynjacb-dock-anchor-horizontal\">\n        <img src=\"http://localhost:8080/nynjacb/images/icn-handle-circle@2x.png\" alt=\"drag\">\n      </span>\n      <span id=\"nynjacb-dock-anchor-vertical\">\n        <img src=\"http://localhost:8080/nynjacb/images/icn-handle-circle@2x.png\" alt=\"drag\">\n      </span>\n    </div>\n    <div id=\"nynjacb-buttons\">\n      <div style=\"display: none\">\n        <button id=\"nynjacb-template-dock-person\" class=\"nynjacb-button nynjacb-dock-person\">\n          <div class=\"nynjacb-tooltip nynjacb-dock-person-tooltip\">\n            <span class=\"nynjacb-person-name\"></span>\n            <span class=\"nynjacb-person-tooltip-arrow-r\"></span>\n          </div>\n          <div class=\"nynjacb-person nynjacb-person-status-overlay\"></div>\n        </button>\n      </div>\n      <button id=\"nynjacb-profile-button\" class=\"nynjacb-button\" title=\"This is you\">\n        <div class=\"nynjacb-person nynjacb-person-self\"></div>\n        <div id=\"nynjacb-profile-arrow\"></div>\n      </button>\n      <button id=\"nynjacb-share-button\" class=\"nynjacb-button\" title=\"Add a friend\"></button>\n      <button id=\"nynjacb-audio-button\" class=\"nynjacb-button\" title=\"Turn on microphone\">\n        <span id=\"nynjacb-audio-unavailable\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\">\n        </span>\n        <span id=\"nynjacb-audio-ready\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n        <span id=\"nynjacb-audio-outgoing\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n        <span id=\"nynjacb-audio-incoming\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n        <span id=\"nynjacb-audio-active\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n        <span id=\"nynjacb-audio-muted\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n        <span id=\"nynjacb-audio-error\" class=\"nynjacb-audio-set\" data-toggles=\".nynjacb-audio-set\" style=\"display: none\">\n        </span>\n      </button>\n      <button id=\"nynjacb-chat-button\" class=\"nynjacb-button\" title=\"Chat\"></button>\n      <div id=\"nynjacb-dock-participants\"></div>\n    </div>\n  </div>\n\n  <!-- The window for editing the avatar: -->\n  <div id=\"nynjacb-avatar-edit\" class=\"nynjacb-modal\"\n       style=\"display: none\">\n    <header> Update avatar </header>\n    <section>\n      <div class=\"nynjacb-avatar-preview nynjacb-person nynjacb-person-self\"></div>\n      <div id=\"nynjacb-avatar-buttons\">\n        <input type=\"file\" class=\"nynjacb-upload-avatar\">\n        <!--<button id=\"nynjacb-upload-avatar\" class=\"nynjacb-primary\">Upload a picture</button>-->\n        <!--<button id=\"nynjacb-camera-avatar\" class=\"nynjacb-default\">Take a picture</button>-->\n      </div>\n    </section>\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-cancel nynjacb-dismiss\">Cancel</button>\n      <span class=\"nynjacb-alt-text\">or</span>\n      <button class=\"nynjacb-avatar-save nynjacb-primary\">Save</button>\n    </section>\n  </div>\n\n  <!-- The window for sharing the link: -->\n  <div id=\"nynjacb-share\" class=\"nynjacb-window\"\n       data-bind-to=\"#nynjacb-share-button\" style=\"display: none\">\n    <header> Invite a friend </header>\n    <section>\n      <div class=\"nynjacb-not-mobile\">\n        <p>Copy and paste this link over IM or email:</p>\n        <input type=\"text\" class=\"nynjacb-share-link\">\n      </div>\n      <div class=\"nynjacb-only-mobile\">\n        <p>Copy and paste this link over IM or email:</p>\n        <input type=\"text\" class=\"nynjacb-share-link\">\n        <!-- <a class=\"nynjacb-share-link\" href=\"#\">Press your thumb here.</a> -->\n      </div>\n    </section>\n  </div>\n\n  <!-- Participant Full List view template: -->\n  <div id=\"nynjacb-participantlist\" class=\"nynjacb-window\"\n       data-bind-to=\"#nynjacb-participantlist-button\" style=\"display: none\">\n    <header> Participants </header>\n    <section>\n      <div class=\"nynjacb-not-mobile\">\n        <ul>\n          <li id=\"nynjacb-participant-item\">\n            <img class=\"nynjacb-person nynjacb-person-small\" src=\"http://localhost:8080/nynjacb/images/btn-menu-change-avatar.png\">\n            <span class=\"tj-name nynjacb-person-name\">NAME</span>\n            <span class=\"tj-status\">&#9679;</span>\n            <p class=\"tj-urllocation\">Currently at: <a class=\"nynjacb-person-url nynjacb-person-url-title\" href=\"\">http://www.location.comwww.location.comwww.location.comasdfsafd</a></p>\n            <p class=\"tj-follow\">Follow:\n              <label class=\"nynjacb-follow-question\" for=\"nynjacb-person-status-follow\">\n                <input type=\"checkbox\" id=\"nynjacb-person-status-follow\">\n              </label>\n            </p>\n            <section class=\"nynjacb-buttons\">\n              <!-- Displayed when the peer is at a different URL: -->\n              <div class=\"nynjacb-different-url\">\n                <a class=\"nynjacb-nudge nynjacb-default tj-btn-sm\">Nudge them</a>\n                <a href=\"#\" class=\"nynjacb-follow nynjacb-person-url nynjacb-primary tj-btn-sm\">Join them</a>\n              </div>\n              <!-- Displayed when the peer is at your same URL: -->\n              <div class=\"nynjacb-same-url\" style=\"display: none\">\n                <span class=\"nynjacb-person-name\"></span> is on the same page as you.\n              </div>\n            </section>\n          </li>\n        </ul>\n    </section>\n  </div>\n\n  <!-- Participant detail template: -->\n  <div id=\"nynjacb-template-participant-window\" class=\"nynjacb-window\" style=\"display: none\">\n    <header><div class=\"nynjacb-person nynjacb-person-small\"></div><span class=\"nynjacb-person-name\"></span></header>\n\n    <section class=\"nynjacb-participant-window-main\">\n      <p class=\"nynjacb-participant-window-row\"><strong>Role:</strong>\n        <span class=\"nynjacb-person-role\"></span>\n      </p>\n\n      <p class=\"nynjacb-participant-window-row\"><strong>Currently at:</strong>\n        <a class=\"nynjacb-person-url nynjacb-person-url-title\"></a>\n      </p>\n\n      <p class=\"nynjacb-participant-window-row\"><strong>Status:</strong>\n        <span class=\"nynjacb-person-status\"></span>\n      </p>\n\n      <p class=\"nynjacb-participant-window-row\"><strong class=\"nynjacb-float-left\">Follow this participant:</strong>\n        <label class=\"nynjacb-follow-question nynjacb-float-left\" for=\"nynjacb-person-status-follow\">\n          <input type=\"checkbox\" id=\"nynjacb-person-status-follow\">\n        </label>\n        <span class=\"nynjacb-clear\"></span>\n      </p>\n\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <!-- Displayed when the peer is at a different URL: -->\n      <div class=\"nynjacb-different-url\">\n        <a class=\"nynjacb-nudge nynjacb-default\">Nudge them</a>\n        <a href=\"#\" class=\"nynjacb-follow nynjacb-person-url nynjacb-primary\">Join them</a>\n      </div>\n      <!-- Displayed when the peer is at your same URL: -->\n      <div class=\"nynjacb-same-url\" style=\"display: none\">\n        <span class=\"nynjacb-person-name\"></span> is on the same page as you.\n      </div>\n    </section>\n  </div>\n\n  <!-- The chat screen: -->\n  <div id=\"nynjacb-chat\" class=\"nynjacb-window\" data-bind-to=\"#nynjacb-chat-button\"\n       style=\"display: none\">\n    <header> Chat </header>\n    <section class=\"nynjacb-subtitle\">\n      <div id=\"nynjacb-chat-participants\" data-toggles=\"#nynjacb-chat-no-participants\" style=\"display: none\">\n        <span id=\"nynjacb-chat-participant-list\"></span>\n        &amp; You\n      </div>\n      <div id=\"nynjacb-chat-no-participants\" data-toggles=\"#nynjacb-chat-participants\">\n        No one else is here.\n      </div>\n    </section>\n\n    <div style=\"display: none\">\n\n      <!-- Template for one message: -->\n      <div id=\"nynjacb-template-chat-message\" class=\"nynjacb-chat-item nynjacb-chat-message\">\n        <div class=\"nynjacb-person\"></div>\n        <div class=\"nynjacb-timestamp\"><span class=\"nynjacb-time\">HH:MM</span> <span class=\"nynjacb-ampm\">AM/PM</span></div>\n        <div class=\"nynjacb-person-name-abbrev\"></div>\n        <div class=\"nynjacb-chat-content nynjacb-sub-content\"></div>\n      </div>\n\n      <!-- Template for when a person leaves: -->\n      <div id=\"nynjacb-template-chat-left\" class=\"nynjacb-chat-item nynjacb-chat-left-item\">\n        <div class=\"nynjacb-person\"></div>\n        <div class=\"nynjacb-ifnot-declinedJoin\">\n          <div class=\"nynjacb-inline-text\"><span class=\"nynjacb-person-name\"></span> left the session.</div>\n        </div>\n        <div class=\"nynjacb-if-declinedJoin\">\n          <div class=\"nynjacb-inline-text\"><span class=\"nynjacb-person-name\"></span> declined to join the session.</div>\n        </div>\n        <div class=\"nynjacb-clear\"></div>\n      </div>\n\n      <!-- Template when a person joins the session: -->\n      <div id=\"nynjacb-template-chat-joined\" class=\"nynjacb-chat-item nynjacb-chat-join-item\">\n        <div class=\"nynjacb-person\"></div>\n        <div class=\"nynjacb-inline-text\"><span class=\"nynjacb-person-name\"></span> joined the session.</div>\n        <div class=\"nynjacb-clear\"></div>\n      </div>\n\n      <!-- Template for system-derived messages: -->\n      <div id=\"nynjacb-template-chat-system\" class=\"nynjacb-chat-item\">\n        <span class=\"nynjacb-chat-content nynjacb-sub-content\"></span>\n      </div>\n\n      <!-- Template when a person joins the session: -->\n      <!-- <div id=\"nynjacb-template-chat-joined\" class=\"nynjacb-chat-item nynjacb-chat-join-item\">\n        <div class=\"nynjacb-person\"></div>\n        <div class=\"nynjacb-inline-text\"><span class=\"nynjacb-person-name\"></span> joined the session.</div>\n        <div class=\"nynjacb-clear\"></div>\n      </div> -->\n\n      <!-- Template for when someone goes to a new URL: -->\n      <div id=\"nynjacb-template-url-change\" class=\"nynjacb-chat-item nynjacb-chat-url-change\">\n        <div class=\"nynjacb-person\"></div>\n        <div class=\"nynjacb-inline-text\">\n          <div class=\"nynjacb-if-sameUrl\">\n            <span class=\"nynjacb-person-name\"></span>\n            is on the same page as you.\n          </div>\n          <div class=\"nynjacb-ifnot-sameUrl\">\n            <span class=\"nynjacb-person-name\"></span>\n            has gone to: <a href=\"#\" class=\"nynjacb-person-url nynjacb-person-url-title\" target=\"_self\"></a>\n            <section class=\"nynjacb-buttons nynjacb-buttons-notification-diff-url\">\n              <!-- Displayed when the peer is at a different URL: -->\n              <div class=\"nynjacb-different-url nynjacb-notification-diff-url\">\n                <a class=\"nynjacb-nudge nynjacb-default\">Nudge them</a>\n                <a href=\"#\" class=\"nynjacb-follow nynjacb-person-url nynjacb-primary\">Join them</a>\n              </div>\n            </section>\n\n            <!-- <div>\n              <a class=\"nynjacb-nudge nynjacb-secondary\">Nudge them</a>\n              <a href=\"\" class=\"nynjacb-person-url nynjacb-follow nynjacb-primary\">Join them</a>\n            </div> -->\n\n          </div>\n        </div>\n        <div class=\"nynjacb-clear\"></div>\n      </div>\n    </div>\n\n    <section id=\"nynjacb-chat-messages\">\n      <!-- FIX ME// need to have some dialogue that says something like - There are no chats yet! -->\n    </section>\n    <section id=\"nynjacb-chat-input-box\">\n      <textarea id=\"nynjacb-chat-input\" placeholder=\"Type your message here\"></textarea>\n    </section>\n  </div>\n\n  <!-- this is a kind of warning popped up when you (successfully) start RTC: -->\n  <div id=\"nynjacb-rtc-info\" class=\"nynjacb-window\"\n       data-bind-to=\"#nynjacb-audio-button\"\n       style=\"display: none\">\n\n    <header> Audio Chat </header>\n    <section>\n      <p>\n        Activate your <strong>browser microphone</strong> near your URL bar above.\n      </p>\n      <p>\n        Talking on your microphone through your web browser is an experimental feature.\n      </p>\n      <p>\n        Read more about Audio Chat <a href=\"https://github.com/mozilla/nynjacb/wiki/About-Audio-Chat-and-WebRTC\" target=\"_blank\">here</a>.\n      </p>\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <label for=\"nynjacb-rtc-info-dismiss\" style=\"display: inline;\">\n        <input class=\"nynjacb-dont-show-again\" id=\"nynjacb-rtc-info-dismiss\" type=\"checkbox\">\n        Don't show again.\n      </label>\n      <button class=\"nynjacb-default nynjacb-dismiss\" type=\"button\">Close</button>\n    </section>\n  </div>\n\n  <!-- this is popped up when you hit the audio button, but RTC isn't\n  supported: -->\n  <div id=\"nynjacb-rtc-not-supported\" class=\"nynjacb-window\"\n       data-bind-to=\"#nynjacb-audio-button\"\n       style=\"display: none\">\n    <header> Audio Chat </header>\n\n    <section>\n      <p>Audio chat requires you to use a <a href='https://github.com/mozilla/nynjacb/wiki/About-Audio-Chat-and-WebRTC' target='_blank'>newer browser</a>!</p>\n      <p>\n        Live audio chat requires a newer (or different) browser than you're using.\n      </p>\n      <p>\n        See <a href='https://github.com/mozilla/nynjacb/wiki/About-Audio-Chat-and-WebRTC' target='_blank'>this page</a>for more information and a list of supported browsers.\n      </p>\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <div class=\"nynjacb-rtc-dialog-btn\">\n        <button class=\"nynjacb-default nynjacb-dismiss\" type=\"button\">Close</button>\n      </div>\n    </section>\n  </div>\n\n  <!-- The popup when a chat message comes in and the #nynjacb-chat window isn't open -->\n  <div id=\"nynjacb-chat-notifier\" class=\"nynjacb-notification\"\n       data-bind-to=\"#nynjacb-chat-button\"\n       style=\"display: none\">\n    <img src=\"http://localhost:8080/nynjacb/images/notification-nynjacb-logo.png\" class=\"nynjacb-notification-logo\" alt=\"\">\n    <img src=\"http://localhost:8080/nynjacb/images/notification-btn-close.png\" class=\"nynjacb-notification-closebtn nynjacb-dismiss\" alt=\"[close]\">\n    <section id=\"nynjacb-chat-notifier-message\">\n    </section>\n  </div>\n\n  <!-- The menu when you click on the profile: -->\n  <div id=\"nynjacb-menu\" class=\"nynjacb-menu\" style=\"display: none\">\n    <div class=\"nynjacb-menu-item nynjacb-menu-disabled\" id=\"nynjacb-menu-profile\">\n      <img id=\"nynjacb-menu-avatar\">\n      <span class=\"nynjacb-person-name-self\" id=\"nynjacb-self-name-display\" data-toggles=\"#nynjacb-menu .nynjacb-self-name\">[nickname]</span>\n      <input class=\"nynjacb-self-name\" type=\"text\" data-toggles=\"#nynjacb-self-name-display\" style=\"display: none\" placeholder=\"Enter your name\">\n    </div>\n    <div class=\"nynjacb-menu-hr-avatar\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-name\"><img src=\"http://localhost:8080/nynjacb/images/button-pencil.png\" alt=\"\"> Update your name</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-avatar\"><img src=\"http://localhost:8080/nynjacb/images/btn-menu-change-avatar.png\" alt=\"\"> Change avatar</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-color\"><span class=\"nynjacb-person-bgcolor-self\"></span> Pick profile color</div>\n    <div class=\"nynjacb-hr\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-help\">Help</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-feedback\">Feedback</div>\n    <div id=\"nynjacb-invite\" style=\"display: none\">\n      <div class=\"nynjacb-hr\"></div>\n      <div id=\"nynjacb-invite-users\"></div>\n      <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-refresh-invite\">Refresh users</div>\n      <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-invite-anyone\">Invite anyone</div>\n    </div>\n    <div class=\"nynjacb-hr\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-end\"><img src=\"http://localhost:8080/nynjacb/images/button-end-session.png\" alt=\"\"> End <span class=\"nynjacb-tool-name\">NynjaCB</span></div>\n  </div>\n\n  <!-- template for one person in the invite-users list -->\n  <div style=\"display: none\">\n    <div id=\"nynjacb-template-invite-user-item\" class=\"nynjacb-menu-item\">\n      <!-- FIXME: should include avatar in some way -->\n      <span class=\"nynjacb-person-name\"></span>\n    </div>\n  </div>\n\n  <!-- A window version of #nynjacb-menu, for use on mobile -->\n  <div id=\"nynjacb-menu-window\" class=\"nynjacb-window\" style=\"display: none\">\n    <header>Settings and Profile</header>\n    <section>\n    <div class=\"nynjacb-menu-item\">\n      <img class=\"nynjacb-menu-avatar\">\n      <span class=\"nynjacb-person-name-self\" id=\"nynjacb-self-name-display\"></span>\n    </div>\n    <div class=\"nynjacb-menu-hr-avatar\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-name-button\"><img src=\"http://localhost:8080/nynjacb/images/button-pencil.png\" alt=\"\"> Update your name</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-avatar-button\"><img src=\"http://localhost:8080/nynjacb/images/btn-menu-change-avatar.png\" alt=\"\"> Change avatar</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-update-color-button\"><span class=\"nynjacb-person-bgcolor-self\"></span> Pick profile color</div>\n    <div class=\"nynjacb-hr\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-help-button\">Help</div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-feedback-button\">Feedback</div>\n    <div class=\"nynjacb-hr\"></div>\n    <div class=\"nynjacb-menu-item\" id=\"nynjacb-menu-end-button\"><img src=\"http://localhost:8080/nynjacb/images/button-end-session.png\" alt=\"\"> End TOOL_NAME</div>\n    </section>\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-dismiss nynjacb-primary\">OK</button>\n    </section>\n  </div>\n\n  <!-- The name editor, for use on mobile -->\n  <div id=\"nynjacb-edit-name-window\" class=\"nynjacb-window\" style=\"display: none\">\n    <header>Update Name</header>\n    <section>\n      <div>\n        <input class=\"nynjacb-self-name\" type=\"text\" placeholder=\"Enter your name\">\n      </div>\n    </section>\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-dismiss nynjacb-primary\">OK</button>\n    </section>\n  </div>\n\n  <div class=\"nynjacb-menu\" id=\"nynjacb-pick-color\" style=\"display: none\">\n    <div class=\"nynjacb-triangle-up\"><img src=\"http://localhost:8080/nynjacb/images/icn-triangle-up.png\"></div>\n    <div style=\"display: none\">\n      <div id=\"nynjacb-template-swatch\" class=\"nynjacb-swatch\">\n      </div>\n    </div>\n  </div>\n\n  <!-- Invisible elements that handle the RTC audio: -->\n  <audio id=\"nynjacb-audio-element\"></audio>\n  <audio id=\"nynjacb-local-audio\" muted=\"true\" volume=\"0.3\"></audio>\n  <audio id=\"nynjacb-notification\" src=\"http://localhost:8080/nynjacb/images/notification.ogg\"></audio>\n\n  <!-- The intro screen for someone who joins a session the first time: -->\n  <div id=\"nynjacb-intro\" class=\"nynjacb-modal\" style=\"display: none\">\n    <header>Join TOOL_NAME session?</header>\n    <section>\n      <p>Your friend has asked you to join their TOOL_SITE_LINK browser session to collaborate in real-time!</p>\n      <p>Would you like to join their session?</p>\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-destructive nynjacb-modal-dont-join\">No, don't join</button>\n      <button class=\"nynjacb-primary nynjacb-dismiss\">Yes, join session</button>\n    </section>\n  </div>\n\n  <!-- Shown when a web browser is completely incapable of running NynjaCB: -->\n  <div id=\"nynjacb-browser-broken\" class=\"nynjacb-modal\" style=\"display: none\">\n    <header> Sorry </header>\n\n    <section>\n      <p>\n        We're sorry, TOOL_NAME doesn't work with this browser.  Please <a href='https://github.com/mozilla/nynjacb/wiki/Supported-Browsers#supported-browsers'>upgrade to a supported browser</a> to try TOOL_NAME.\n      </p>\n\n      <p id=\"nynjacb-browser-broken-is-ie\" style=\"display: none\">\n        We need your help fixing NynjaCB on Internet Explorer!  Here are a list of IE <a href=\"https://github.com/mozilla/nynjacb/issues?labels=IE&milestone=&page=1&state=open\" target=\"_blank\">GitHub issues</a> we need fixed that you can work on.\n        Internet Explorer <a href=\"https://github.com/mozilla/nynjacb/wiki/Supported-Browsers#internet-explorer\">is currently not supported</a>.  If you do want to try out NynjaCB, we'd suggest using Firefox or Chrome.\n      </p>\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-dismiss nynjacb-primary\">End TOOL_NAME</button>\n    </section>\n\n  </div>\n\n  <!-- Shown when the browser has WebSockets, but is IE (i.e., IE10) -->\n  <div id=\"nynjacb-browser-unsupported\" class=\"nynjacb-modal\" style=\"display: none\">\n    <header> Unsupported Browser </header>\n\n    <section>\n      <p>\n        We need your help fixing NynjaCB on Internet Explorer!  Here are a list of IE <a href=\"https://github.com/mozilla/nynjacb/issues?labels=IE&milestone=&page=1&state=open\" target=\"_blank\">GitHub issues</a> we need fixed that you can work on.\n        Internet Explorer <a href=\"https://github.com/mozilla/nynjacb/wiki/Supported-Browsers#internet-explorer\">is currently not supported</a>.  If you do want to try out NynjaCB, we'd suggest using Firefox or Chrome.\n      </p>\n\n      <p>You can continue to try to use TOOL_NAME, but you are likely to hit lots of bugs.  So be warned.</p>\n\n    </section>\n\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-dismiss nynjacb-primary\">End TOOL_NAME</button>\n      <button class=\"nynjacb-dismiss nynjacb-secondary nynjacb-browser-unsupported-anyway\">Try TOOL_NAME Anyway</button>\n    </section>\n\n  </div>\n\n  <div id=\"nynjacb-confirm-end\" class=\"nynjacb-modal\" style=\"display: none\">\n    <header> End session? </header>\n    <section>\n      <p>\n        Are you sure you'd like to end your TOOL_NAME session?\n      </p>\n    </section>\n    <section class=\"nynjacb-buttons\">\n      <button class=\"nynjacb-cancel nynjacb-dismiss\">Cancel</button>\n      <span class=\"nynjacb-alt-text\">or</span>\n      <button id=\"nynjacb-end-session\" class=\"nynjacb-destructive\">End session</button>\n    </section>\n  </div>\n\n  <div id=\"nynjacb-feedback-form\" class=\"nynjacb-modal\" style=\"display: none;\">\n    <header> Feedback </header>\n    <iframe src=\"https://docs.google.com/a/mozilla.com/forms/d/1lVE7JyRo_tjakN0mLG1Cd9X9vseBX9wci153z9JcNEs/viewform?embedded=true\" width=\"400\" height=\"300\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\">Loading form...</iframe>\n    <!-- <p><button class=\"nynjacb-modal-close\">Close</button></p> -->\n  </div>\n\n  <div style=\"display: none\">\n    <!-- This is when you join a session and the other person has already changed to another URL: -->\n    <div id=\"nynjacb-template-url-change\" class=\"nynjacb-modal\">\n      <header> Following to new URL... </header>\n      <section>\n        <div class=\"nynjacb-person\"></div>\n        Following\n        <span class=\"nynjacb-person-name\"></span>\n        to <a href=\"\" class=\"nynjacb-person-url nynjacb-person-url-title\"></a>\n      </section>\n    </div>\n\n    <!-- This is when someone invites you to their session: -->\n    <div id=\"nynjacb-template-invite\" class=\"nynjacb-chat-item\">\n      <div class=\"nynjacb-person\"></div>\n      <div>\n        <span class=\"nynjacb-person-name\"></span>\n        has invited <strong class=\"nynjacb-if-forEveryone\">anyone</strong>\n        <strong class=\"nynjacb-ifnot-forEveryone\">you</strong>\n        to <a href=\"\" data-nynjacb-subattr-href=\"href\" class=\"nynjacb-sub-hrefTitle\" target=\"_blank\"></a>\n      </div>\n    </div>\n\n  </div>\n\n  <!-- The pointer at the side of a window: -->\n  <div id=\"nynjacb-window-pointer-right\" style=\"display: none\"></div>\n  <div id=\"nynjacb-window-pointer-left\" style=\"display: none\"></div>\n\n  <!-- The element that overlaps the background of the page during a modal dialog: -->\n  <div id=\"nynjacb-modal-background\" style=\"display: none\"></div>\n\n  <!-- Some miscellaneous templates -->\n  <div style=\"display: none\">\n\n    <!-- This is the cursor: -->\n    <div id=\"nynjacb-template-cursor\" class=\"nynjacb-cursor nynjacb\">\n      <!-- Note: images/cursor.svg is a copy of this (for editing): -->\n      <!-- crossbrowser svg dropshadow http://demosthenes.info/blog/600/Creating-a-True-CrossBrowser-Drop-Shadow- -->\n      <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n      \t width=\"15px\" height=\"22.838px\" viewBox=\"96.344 146.692 15 22.838\" enable-background=\"new 96.344 146.692 15 22.838\"\n      \t xml:space=\"preserve\">\n      <path fill=\"#231F20\" d=\"M98.984,146.692c2.167,1.322,1.624,6.067,3.773,7.298c-0.072-0.488,2.512-0.931,3.097,0\n      \tc0.503,0.337,1.104-0.846,2.653,0.443c0.555,0.593,3.258,2.179,1.001,8.851c-0.446,1.316,2.854,0.135,1.169,2.619\n      \tc-3.748,5.521-9.455,2.787-9.062,1.746c1.06-2.809-6.889-4.885-4.97-9.896c0.834-2.559,2.898,0.653,2.923,0.29\n      \tc-0.434-1.07-2.608-5.541-2.923-6.985C96.587,150.793,95.342,147.033,98.984,146.692z\"/>\n      </svg>\n      <!-- <img class=\"nynjacb-cursor-img\" src=\"http://localhost:8080/nynjacb/images/cursor.svg\"> -->\n      <span class=\"nynjacb-cursor-container\">\n        <span class=\"nynjacb-cursor-name\"></span>\n        <span style=\"display:none\" class=\"nynjacb-cursor-typing\" id=\"nynjacb-cursor-typebox\">\n          <span class=\"nynjacb-typing-ellipse-one\">&#9679;</span><span class=\"nynjacb-typing-ellipse-two\">&#9679;</span><span class=\"nynjacb-typing-ellipse-three\">&#9679;</span>\n        </span>\n        <!-- Displayed when the cursor is below the screen: -->\n        <span class=\"nynjacb-cursor-down\">\n\n        </span>\n        <!-- Displayed when the cursor is above the screen: -->\n        <span class=\"nynjacb-cursor-up\">\n\n        </span>\n      </span>\n    </div>\n\n    <!-- This is the element that goes around focused form elements: -->\n    <div id=\"nynjacb-template-focus\">\n      <div class=\"nynjacb-focus nynjacb-person-bordercolor\"></div>\n    </div>\n\n    <!-- This is a click: -->\n    <div id=\"nynjacb-template-click\" class=\"nynjacb-click nynjacb\">\n    </div>\n  </div>\n</div>\n",
    walkthrough: "<!--\n    Any elements with .nynjacb-walkthrough-firsttime will only be\n    displayed on during the first-time experience.  Any elements with\n    .nynjacb-walkthrough-not-firsttime will only be displayed when\n    the walkthrough is accessed through the Help menu.\n\n    Note you *cannot* use <section class=\"nynjacb-walkthrough-slide\n    nynjacb-walkthrough-firsttime\">: the number of sections must be the\n    same regardless.\n  -->\n<div id=\"nynjacb-walkthrough\" class=\"nynjacb-modal nynjacb-modal-wide\">\n  <header>You're using TOOL_NAME!<button class=\"nynjacb-close\"></button></header>\n\n  <div id=\"nynjacb-walkthrough-previous\"></div>\n  <div id=\"nynjacb-walkthrough-next\"></div>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-intro.png\"></p>\n\t<p>TOOL_NAME is a service for your website that makes it easy to collaborate in real-time on SITE_NAME </p>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <div class=\"nynjacb-walkthrough-firsttime\">\n      <div class=\"nynjacb-walkthrough-main-image\">\n        <div class=\"nynjacb-walkthrough-avatar-section\">\n          <div class=\"nynjacb-avatar-preview nynjacb-person nynjacb-person-self\"></div>\n          <div class=\"nynjacb-avatar-upload-input\"><input type=\"file\" class=\"nynjacb-upload-avatar\"></div>\n        </div>\n        <input class=\"nynjacb-self-name\" type=\"text\" placeholder=\"Enter your name\">\n        <div class=\"nynjacb-swatch nynjacb-person-bgcolor-self\"></div>\n        <div class=\"nynjacb-save-settings\">\n          <button class=\"nynjacb-avatar-save nynjacb-primary\">\n            <span id=\"nynjacb-avatar-when-unsaved\">\"\"Save\"\"</span>\n            <span id=\"nynjacb-avatar-when-saved\" style=\"display: none\">Saved!</span>\n          </button>\n        </div>\n      </div>\n      <p>Set up your avatar, name and user color above.  If you'd like to update it later, you can click your Profile button.</p>\n    </div>\n    <div class=\"nynjacb-walkthrough-not-firsttime\">\n      <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-profile.png\"></p>\n      <p>Change your avatar, name and user color using the Profile button.</p>\n    </div>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image nynjacb-ifnot-creator\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-invite.png\">\n    </p>\n    <p class=\"nynjacb-ifnot-creator\">You can invite more friends to the session by sending the invite link in the TOOL_NAME dock.</p>\n    <p class=\"nynjacb-walkthrough-main-image nynjacb-if-creator\">\n      <span class=\"nynjacb-walkthrough-sendlink\">\n        Copy and paste this link into IM or email to invite friends.\n      </span>\n      <input type=\"text\" class=\"nynjacb-share-link\">\n    </p>\n    <p class=\"nynjacb-if-creator\">Send the above link to a friend so they can join your session!  You can find this invite link on the TOOL_NAME dock as well.</p>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-participant.png\"></p>\n    <p>Friends who join your TOOL_NAME session will appear here.  You can click their avatars to see more.</p>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-chat.png\"></p>\n    <p>When your friends join you in your TOOL_NAME session, you can chat with them here!</p>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-rtc.png\"></p>\n    <p>If your browser supports it, click the microphone icon to begin an audio chat. Learn more about this experimental feature <a href=\"https://github.com/mozilla/nynjacb/wiki/About-Audio-Chat-and-WebRTC\" target=\"_blank\">here</a>.</p>\n  </section>\n\n  <section class=\"nynjacb-walkthrough-slide\">\n    <p class=\"nynjacb-walkthrough-main-image\"><img src=\"http://localhost:8080/nynjacb/images/walkthrough-images-logo.png\"></p>\n    <p>Alright, you're ready to use TOOL_NAME. Now start collaborating on SITE_NAME!</p>\n  </section>\n\n  <div style=\"display: none\">\n    <!-- There is one of these created for each slide: -->\n    <span id=\"nynjacb-template-walkthrough-slide-progress\" class=\"nynjacb-walkthrough-slide-progress\">&#9679;</span>\n  </div>\n  <section id=\"nynjacb-walkthrough-progress\">\n  </section>\n\n  <section class=\"nynjacb-buttons\">\n    <button class=\"nynjacb-primary nynjacb-dismiss\">I'm ready!</button>\n  </section>\n\n</div><!-- /.nynjacb-modal -->\n",
    names: "Friendly Fox, Brilliant Beaver, Observant Owl, Gregarious Giraffe, Wild Wolf, Silent Seal, Wacky Whale, Curious Cat, Intelligent Iguana"
  };
});
