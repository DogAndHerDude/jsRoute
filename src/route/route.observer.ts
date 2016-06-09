'use strict';

import Route from './route.model';
import * as utils from '../utils/utils';
import $http from '../http/http';
import * as $history from '../history/history';

var routes: Array<Route> = [];
var fallback = '/';

function monitorRouteChange(): void {
  let root = utils.getRoot();

  root.addEventListener('routeChange', changeCallback, false);
}

function insertTemplate(route: Route, callback): void {
  const isCached = route.isCached();
  var view = utils.getView();

  if (!isCached) {
    $http.get(route.options.templateUrl, (err, data) => {
      if (err) { return callback(err); }
      if (!data) { return callback(); }

      view.innerHTML = data;

      if (route.options.cache && !isCached) {
        route.storeTemplateToCache(data);
      }

      return callback(null, true);
    });
  } else {
    view.innerHTML = route.getCachedTemplate();
    return callback(null, true);
  }
}

function changeCallback(ev): void {
  if (!ev.defaultPrevented) {
    var next = ev.detail.next;
    var prev = ev.detail.prev;

    //If host is not own site : redirect
    if (next.host !== prev.host) { window.location.assign(next.href); }

    findMatch(next, (match) => {
      if (!match) { return next.path(fallback); }
      $history.push(match, next.pathname);
      next.matchingPath = match.path;
      next.params = match.getParams(next.pathname);

      insertTemplate(match, (err, success) => {
        if (err) { return console.error(err); }
        if (!success) { return console.error('No template retrieved from templateUrl'); }
        if (match.options.onLoad) { match.options.onLoad(utils.getRoot(), next); }
      });
    });
  }
}

function findMatch(next, callback): void {
  for (let i = 0, ii = routes.length; i < ii; i++) {
    if (routes[i].matchRoute(next.pathname)) {
        return callback(routes[i]);
    }
  }

  return callback();
}

function addRoute(route): void {
  route.options.cache = !route.options.cache ? false : true;
  routes.push(route);
}

function addFallback(redirectTo): void {
  fallback = window.location.origin + redirectTo;
}

function start(): void {
  monitorRouteChange();
  $history.monitorBrowserNavigation();
}

export { start };
export { addRoute };
export { addFallback };
