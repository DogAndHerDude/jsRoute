'use strict';

import { startRouteChange } from '../router/router.events';
import { constructRoute, $Location } from '../location/location.model';
import { getRoot } from '../utils/utils';

var $history: Array<string> = [];
var $$history = window.history;
var currentIndex: number = -1;

function push(route, pathname) {
  let splitTemplate: Array<string> = route.options.templateUrl.split('/');
  let templateName: string = splitTemplate.pop();

  if($history[currentIndex - 1] === pathname) {
    currentIndex--;
  } else if($history[currentIndex + 1] === pathname) {
    currentIndex++;
  } else {
    $history.push(pathname);
    currentIndex = $history.length - 1;
    $$history.pushState({path: pathname}, templateName, pathname);
  }

}

function monitorBrowserNavigation() {
  window.addEventListener('popstate', (ev) => {
    ev.preventDefault();
    console.log(ev);
    startRouteChange(constructRoute(ev.state.path));
  });
}

export { push };
export { monitorBrowserNavigation };
