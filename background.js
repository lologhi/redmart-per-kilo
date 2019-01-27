// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.browserAction.onClicked.addListener(function(activeTab) {
	console.log("updating prices");
    chrome.tabs.executeScript(null, {file: "src/inject/inject.js"});
});

chrome.commands.onCommand.addListener(function(command) {
	console.log('Command:', command);
    chrome.tabs.executeScript(null, {file: "src/inject/inject.js"});
});
