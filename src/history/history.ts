'use strict';

import { startRouteChange } from '../router/router.events';

var $history = window.history;
var popStateInvoked = false;

function push(route, pathname) {
  let splitTemplate: Array<string> = route.options.templateUrl.split('/');
  let templateName: string = splitTemplate.pop();

  if (!popStateInvoked) {
    $history.pushState({path: pathname}, templateName, pathname);
  }

  popStateInvoked = false;
}

function monitorBrowserNavigation() {
  window.addEventListener('popstate', (ev) => {
    ev.preventDefault();
    popStateInvoked = true;
    startRouteChange(ev.state.path);
  });
}

export { push };
export { monitorBrowserNavigation };
