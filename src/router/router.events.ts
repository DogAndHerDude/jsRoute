"use strict";

import * as eventHandler from "../events/eventHandler";
import { _Location } from "../location/location.model";
import * as utils from "../utils/utils";

function startRouteChange(location) {
  eventHandler.broadcastEvent("routeChange", utils.getRoot(), { detail: location });
}

function interceptLinks() {
  eventHandler.onEvent('click', utils.getRoot(), (ev) => {
    if(ev.target.nodeName === "A") {
      let prev;
      let next;

      ev.preventDefault();

      prev = window.location;
      //Start decosntructing the route and create a new location object out of it
      next = new _Location(ev.target.href);

      //If host is not own site : redirect
      if(next.host !== prev.host) {
        window.location.assign(nextLocation.href);
      }

      // Start route matching
      startRouteChange({next, prev});
    }
  });

}

function register() {
  interceptLinks();
}

export { register };
