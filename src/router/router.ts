"use strict";

import * as events from "./router.events";
import * as observer from "../route/route.observer";
import { Route } from "../route/route.model";
import { RouteOptions } from "../route/route.model";
import routeProvider from "../route/route.provider";
import * as utils from "../utils/utils";

class Router {
  constructor(rootElement, view) {
    utils.setRoot(rootElement);
    utils.setView(view);
  }

  public config(callback:(routeProvider: Object) => void): void {
    callback(routeProvider);

    events.register();
    observer.start();
    events.onRun();
  }
}

export { Router as JSRoute };
