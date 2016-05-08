"use strict";

import * as events from "./router.events";
import * as observer from "../route/route.observer";
import { Route } from "../route/route.model";
import { RouteOptions } from "../route/route.model";
import { setRoot } from "../utils/utils";

export class Router {
  constructor(rootElement) {
    setRoot(rootElement);
    events.register();
  }

  public when(path: string, options: RouteOptions): void {
    let route = new Route(path, options);

    observer.addRoute(route);
  }

  public otherwise(redirectTo: string): void {

  }
}
