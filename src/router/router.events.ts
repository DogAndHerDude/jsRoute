'use strict';

import broadcastEvent from '../events/eventHandler';
import { createRouteList } from '../location/location.factory';
import * as utils from '../utils/utils';

function onRun() {
  let view = utils.getView();
  // Determine current route and load the template based on it
  if (view.children.length) { return; }
  startRouteChange(window.location.pathname);
  //startRouteChange(routeFactory(window.location.origin + window.location.pathname));
}

function startRouteChange(url: string) {
  let root = utils.getRoot();
  let routeList = createRouteList(url);

  broadcastEvent('routeChangeStart', root, { detail: routeList });
}

function interceptLinks() {
  let root = utils.getRoot();

  root.addEventListener('click', (ev) => {
    if (ev.target.nodeName === 'A') {
      ev.preventDefault();
      // Start route matching and change
      startRouteChange(ev.target.href);
    }
  });
}

function completeRouteChange(routeList) {
  let root = utils.getRoot();

  broadcastEvent('routeChangeSuccess', root, { detail: routeList });
}

function failRouteChange(routeList) {
  let root = utils.getRoot();

  broadcastEvent('routeChangeError', root, { detail: routeList });
}

function register() {
  interceptLinks();
}

export { register };
export { startRouteChange, completeRouteChange, failRouteChange };
export { onRun };
