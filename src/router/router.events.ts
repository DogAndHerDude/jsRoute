"use strict";

import * as eventHandler from "../events/eventHandler";
import { _Location } from "../location/location.model";
import * as utils from "../utils/utils";

function startRouteChange(location) {
  eventHandler.broadcastEvent("routeChange", utils.getRoot(), location);
}

function interceptLinks() {
  eventHandler.onEvent('click', utils.getRoot(), (ev) => {
    if(ev.target.nodeName === "A") {
      let location;

      ev.preventDefault();

      //Start decosntructing the route and create a new location object out of it
      location = new _Location(ev.target.href);

      //If host is not own site : redirect
      /*if() {
        return location.path();
      }*/

      // Start route matching
      startRouteChange(location);
    }
  });

}

function register() {
  interceptLinks();
}

export { register };
