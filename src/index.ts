"use strict";

import * as routeModel from "./route.model";
import { Router } from "./router";

interface JSRoute {
  when(path: string, options: routeModel.RouteOptions): void;
}

function run() {
  var jsRoute = <JSRoute>{};
  var watcher = new Router();

  function when(path: string, options: routeModel.RouteOptions): void {
    watcher.registerPath(path, options);
  }

  jsRoute.when = when;

  return jsRoute;
}

let jsRoute = run();

(<any>window).jsRoute = (<any>window).jsRoute || jsRoute;
