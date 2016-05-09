"use strict";

import * as events from "./router.events";
import * as observer from "../route/route.observer";
import { Route } from "../route/route.model";
import { RouteOptions } from "../route/route.model";
import * as utils from "../utils/utils";

export class Router {
  constructor(rootElement) {
    utils.setRoot(rootElement);
    events.register();
    observer.start();
  }

  public when(path: string, options: RouteOptions): void {
    let route = new Route(path, options);

    observer.addRoute(route);
  }

  public otherwise(redirectTo: string): void {
    observer.addFallback(redirectTo);
  }
}
