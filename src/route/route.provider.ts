'use strict';

import RouteInterface from '../typings/route/route.d';

import Route from './route.model';
import * as observer from './route.observer';


// routeList should be an object
// Rather a hashmap
// use symbol as a way to store specific route expressions as keys
var routeList: Array<Route> = [];

function exists(routeString: string): boolean {

}

function addRoute(path: string, options: RouteInterface.RouteOptions): void {
  let route: Route = new Route(path, options);

  routeList.push(route);
}

function getRoute(path: string): Route

/*
 * Deprecated old method for configuring routes
 */

var publicProvider: RouteInterface.RouteProvider = {
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

export default publicProvider;
