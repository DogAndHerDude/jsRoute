'use strict';

import { Route, RouteOptions } from "./route.model";
import * as observer from "./route.observer";

interface Provider {
  when(path: string, options: RouteOptions): Object;
  otherwise(path: string): Object;
}

var provider: Provider = {
  when(path, options) {
    let route = new Route(path, options);

    observer.addRoute(route);

    return this;
  },

  otherwise(path) {
    observer.addFallback(path);

    return this;
  }
};

export default provider;
