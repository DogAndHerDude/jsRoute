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

    // Needs to register paths first then start the observer
    // Also needs to fire run method when the page loads so it could serve the base page first
  }

  public when(path: string, options: RouteOptions): Object {
    let route = new Route(path, options);

    observer.addRoute(route);

    return this;
  }

  public otherwise(redirectTo: string): Object {
    observer.addFallback(redirectTo);

    observer.start();
    return this;
  }
}
