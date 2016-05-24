"use strict";

import * as eventHandler from "../events/eventHandler";
import { constructRoute } from "../location/location.model";
import * as utils from "../utils/utils";

function onRun() {
  // Determine current route and load the template based on it
  startRouteChange(constructRoute(window.location.origin + window.location.pathname));
}

function startRouteChange(location) {
  var root = utils.getRoot();
  eventHandler.broadcastEvent("routeChange", root, { detail: location });
}

function interceptLinks() {
  var root = utils.getRoot();

  root.addEventListener('click', (ev) => {
    if(ev.target.nodeName === "A") {
      ev.preventDefault();
      // Start route matching and change
      startRouteChange(constructRoute(ev.target.href));
    }
  });
}

function register() {
  interceptLinks();
}

export { register };
export { startRouteChange };
export { onRun };
