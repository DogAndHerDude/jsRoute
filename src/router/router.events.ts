"use strict";

import * as eventHandler from "../events/eventHandler";
import { constructRoute } from "../location/location.model";
import * as utils from "../utils/utils";

function onRun() {
  // Determine current route and load the template based on it
  startRouteChange(window.location.origin + window.location.pathname);
}

function startRouteChange(location) {
  eventHandler.broadcastEvent("routeChange", utils.getRoot(), { detail: location });
}

function interceptLinks() {
  eventHandler.onEvent('click', utils.getRoot(), (ev) => {
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
