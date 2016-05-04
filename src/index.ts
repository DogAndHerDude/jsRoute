"use strict";

import * as routeModel from "./route.model";
import { Router } from "./router";

interface JSRoute {
  when(path: string, options: routeModel.RouteOptions): void;
}

function run() {
  var jsRoute = <JSRoute>{};
  var router = new Router();

  function when(path: string, options: routeModel.RouteOptions): void {
    router.registerRoute(path, options);
  }

  jsRoute.when = when;

  return jsRoute;
}

let jsRoute = run();

(<any>window).jsRoute = (<any>window).jsRoute || jsRoute;
