"use strict";

import * as routeModel from "./route.model";
import { LocationWatcher } from "./locationWatcher";

interface JSRoute {
  when(path: string, options: routeModel.RouteOptions): void;
}

function run() {
  var jsRoute = <JSRoute>{};
  var watcher = new LocationWatcher();

  watcher.onChange(function(ev) {
    ev.preventDefault();
  });

  function when(path: string, options: routeModel.RouteOptions): void {
    watcher.registerPath(path, options);
  }

  jsRoute.when = when;

  return jsRoute;
}

let jsRoute = run();

window['jsRoute'] = window['jsRoute'] || jsRoute;
