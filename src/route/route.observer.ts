"use strict";

import * as routeModel from "./route.model";
import * as eventHandler from "../events/eventHandler";
import * as utils from "../utils/utils";
import $http from "../http/http";
import * as $history from '../history/history';

var routes: Array<routeModel.Route> = [];
var fallback: string = "/";
var pageIndex = 0;

function monitorRouteChange() {
  var root = utils.getRoot();

  root.addEventListener('routeChange', changeCallback, false);
  //eventHandler.onEvent("routeChange", utils.getRoot(), changeCallback);
}

function changeCallback(ev) {
  if(!ev.defaultPrevented) {
    var next= ev.detail.next;
    var prev = ev.detail.prev;

    //If host is not own site : redirect
    if(next.host !== prev.host) window.location.assign(next.href);

    findMatch(next, (match) => {
      if(!match) return next.path(fallback);
      $history.push(match, next.pathname);
      //history.pushState({path: next.pathname}, 'page', next.pathname);
      next.matchingPath = match.path;
      $http.get(match.options.templateUrl, (err, data) => {
        var view = utils.getView();

        view.innerHTML = data;

        if(match.options.onLoad) match.options.onLoad(utils.getRoot(), next);
      });
    });
  }
}

function findMatch(next, callback) {
  for(let i = 0, ii = routes.length; i < ii; i++) {
    if(routes[i].matchRoute(next.pathname)) {
        return callback(routes[i]);
    }
  }

  return callback();
}

function addRoute(route) {
  routes.push(route);
}

function addFallback(redirectTo) {
  fallback = window.location.origin + redirectTo;
}

function start() {
  monitorRouteChange();
  $history.monitorBrowserNavigation();
}

export { start };
export { addRoute };
export { addFallback };
