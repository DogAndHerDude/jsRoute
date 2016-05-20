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

  public when(path: string, options: RouteOptions): Object {
    let route = new Route(path, options);

    observer.addRoute(route);

    return this;
  }

  public otherwise(redirectTo: string): Object {
    observer.addFallback(redirectTo);

    return this;
  }
}
