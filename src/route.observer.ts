"use strict";

import * as routeModel from "./route.model";

var routes: Array<routeModel.Route> = [];

function addRoute(route) {
  routes.push(route);
}

function start() {

}

export { start };
export { addRoute };
