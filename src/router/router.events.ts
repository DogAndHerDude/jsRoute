'use strict';

import LocationInterface from '../typings/location/location.d';

import broadcastEvent from '../events/eventHandler';
import routeFactory from '../location/location.model';
import * as utils from '../utils/utils';

function onRun() {
  // Determine current route and load the template based on it
  startRouteChange(routeFactory(window.location.origin + window.location.pathname));
}

function startRouteChange(location) {
  var root = utils.getRoot();
  var locationList: LocationInterface.LocationList = location;

  broadcastEvent('routeChange', root, { detail: locationList });
}

function interceptLinks() {
  var root = utils.getRoot();

  root.addEventListener('click', (ev) => {
    if (ev.target.nodeName === 'A') {
      ev.preventDefault();
      // Start route matching and change
      startRouteChange(routeFactory(ev.target.href));
    }
  });
}

function register() {
  interceptLinks();
}

export { register };
export { startRouteChange };
export { onRun };
