"use strict";

import * as routeModel from "./route.model";
import * as eventHandler from "../events/eventHandler";
import * as utils from "../utils/utils";

var routes: Array<routeModel.Route> = [];
var fallback: string;

function findMatch(nextLocation, callback) {
  var nextPathArray = nextLocation.pathname.split('/');

  console.log(nextPathArray);
  console.log(routes);

  for(let i = 0, ii = routes.length; i < ii; i++) {
    routes[i].matchRoute(nextPathArray, (match) => {
      if(match) {
        return callback(match);
      }
    });
  }

  return callback();
}

function addRoute(route) {
  routes.push(route);
}

function addFallback(redirectTo) {
  fallback = redirectTo;
}

function start() {
  eventHandler.onEvent("routeChange", utils.getRoot(), (ev) => {
    var nextLocation = ev.detail.next;
    var prevLocation = ev.detail.prev;

    if(nextLocation.host !== prevLocation.host) {
      window.location.assign(nextLocation.href);
    }

    findMatch(nextLocation, (match) => {

    });
  });
}

export { start };
export { addRoute };
export { addFallback };
