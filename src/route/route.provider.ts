'use strict';

import RouteInterface from '../typings/route/route.d';

import { Route } from "./route.model";
import * as observer from "./route.observer";

var provider: RouteInterface.RouteProvider = {
  when(path, options): RouteInterface.RouteProvider {
    let route = new Route(path, options);

    observer.addRoute(route);

    return this;
  },

  otherwise(path): RouteInterface.RouteProvider {
    observer.addFallback(path);

    return this;
  }
};

export default provider;
