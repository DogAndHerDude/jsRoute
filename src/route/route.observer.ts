'use strict';

/*
 * Events should be moved onto router.events.ts
 * This should be renamed to route handler of some sort, as it is not an observer
 * Should contain methods refering to cechking routes
 */

import Route from './route.model';
import { completeRouteChange } from '../router/router.events';
import * as utils from '../utils/utils';
import $http from '../http/http';
import * as $history from '../history/history';
import { getCurrentLocation, setCurrentLocation, locationFactory } from '../location/location.factory';

var routes: Array<Route> = [];
var defaultFallback = '/';
var matchedRoute: Route | void = null;

// Temp require declaration
/*
 * Load template from specified url
 * Could potentiatially remove the http module and just replace it with require
 * Before loading template, determine whether the template has been cached
 * In the case that it has been, load the cached version instead
 * Should add a way to clear cache
 */

function loadTemplate(route: Route, callback): void {
  const cachedTemplate = route.getCachedTemplate();
  let view = utils.getView();

  if (!cachedTemplate) {

    // Testing require
    // Missing require declaration in typescript
    // Why isn't it there by default?
    // Who thought this was a good idea?

    /*let tmpl = require(route.options.templateUrl);
    console.log(tmpl);*/
    $http.get(route.options.templateUrl, (err, data) => {

      /*
       * Should escape dangerous strings
       * Alternatively provide a way to inject middleware into it
       * Middleware could be event driven
       * Perhaps too much hassle
       */

      if (err) { return callback(err); }
      if (!data) { return callback(); }

      view.innerHTML = data;

      if (route.options.cache && !cachedTemplate) {
        route.setCachedTemplate(data);
      }

      return callback(null, true);
    });
  } else {
    view.innerHTML = cachedTemplate;
    return callback(null, true);
  }
}

/*
 * Initiate route change
 * Should invoke on routeChangeSuccess
 * Currently it has logic to determine whether success or fail event will be fired
 * The events should be delegated to another function
 */

function startChange(ev): void {
  if (ev.defaultPrevented) { return; }

  let routeList = ev.detail;
  let prevLocation = getCurrentLocation();
  let nextLocation = locationFactory(routeList.next.path);

  if (prevLocation && (prevLocation.host !== nextLocation.host)) {
    return window.location.assign(nextLocation.href);
  }

  findMatch(nextLocation, (match) => {
    // Create an error for route change
    if (!match) { /*return routeChangeFail('No matcing route');*/ }

    matchedRoute = match;

    /*
     * Should not give this much information to the router
     * Should just only keep previous/next route info
     */


    nextLocation.matchingPath = routeList.next.match = match.path;
    nextLocation.params = match.getParams;

    /*
     * Need to change routeList to link to prev/next obj instead
     */

    console.log(routeList);

    completeRouteChange(match, routeList, nextLocation);
  });
}

/*
 * Should instead load matching route and next/prev location from location
 */

function endChange(ev): void {
  let match = ev.detail.match;
  let routeList = ev.detail.routeList;
  let nextLocation = ev.detail.nextLocation;

  $history.push(match, nextLocation.pathname);
  setCurrentLocation(nextLocation);

  loadTemplate(match, (err, success) => {
    if (err) { return console.error(err); }
    if (!success) {
      routeList.err = 'Failed to retrieve templatefrom template URL';
      return console.error(routeList.err);
    }

    if (match.options.onLoad) {
      match.options.onLoad(utils.getRoot(), nextLocation);
    }
  });
}

/*
 * Attempts to find a match within registered route array
 */

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
  defaultFallback = redirectTo;
}

function start(): void {
  $history.monitorBrowserNavigation();
}

export { start, addRoute, addFallback, startChange, endChange };
