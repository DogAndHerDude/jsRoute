"use strict";

import * as routeModel from "./route.model";
import * as eventHandler from "./eventHandler";

export class Router {
  private location;
  private history;
  private routes: Array<routeModel.Route>;
  private rootElement;

  constructor() {
    var self = this;

    self.history = window.history;
    self.location = window.location;

    self.registerListeners();
  }

  private registerListeners(): void {
    var self = this;

    self.rootElement = document.querySelector('.jsroute-view');

    self.interceptLinks();
  }

  private interceptLinks(): void {
    var self = this;

    eventHandler.onEvent('click', self.rootElement, (ev) => {
      if(ev.target.nodeName === "A") {
        ev.preventDefault();
        console.log(ev.target.href);
        console.log(self.location);
      }
    });
  }

  private handleRoute(): void {
    
  }

  public registerPath(path: string, options: routeModel.RouteOptions): void {
    var self = this;

    self.routes.push(new routeModel.Route(path, options));
  }
}
