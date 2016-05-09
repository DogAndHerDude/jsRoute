"use strict";

import * as routeModel from "./route.model";
import * as eventHandler from "../events/eventHandler";
import * as utils from "../utils/utils";

var routes: Array<routeModel.Route> = [];
var fallback: string;

function addRoute(route) {
  routes.push(route);
}

function addFallback(redirectTo) {
  fallback = redirectTo;
}

function start() {
  eventHandler.onEvent("routeChange", utils.getRoot(), (ev) => {
    console.log(ev);
  });
}

export { start };
export { addRoute };
export { addFallback };
