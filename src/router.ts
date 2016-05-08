"use strict";

import * as events from "./router.events";
import * as observer from "./route.observer";
import { Route } from "./route.model";
import { RouteOptions } from "./route.model";

export class Router {
  private location: Object;
  private history: Object;

  constructor() {
    var self = this;

    self.history = window.history;
    self.location = window.location;

    events.register();
  }

  public registerRoute(path: string, options: RouteOptions): void {
    let route = new Route(path, options);

    observer.addRoute(route);
  }
}
