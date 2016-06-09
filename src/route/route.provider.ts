'use strict';

import RouteInterface from '../typings/route/route.d';

import Route from './route.model';
import * as observer from './route.observer';

var provider: RouteInterface.RouteProvider = {
  when(path: string, options: RouteInterface.RouteOptions): RouteInterface.RouteProvider {
    let route: Route = new Route(path, options);

    observer.addRoute(route);

    return this;
  },

  otherwise(path: string): RouteInterface.RouteProvider {
    observer.addFallback(path);

    return this;
  }
};

export default provider;
