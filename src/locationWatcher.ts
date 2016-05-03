"use strict";

import * as routeModel from "./route.model";
import * as eventHandler from "./eventHandler";

export class LocationWatcher {
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

    eventHandler.onEvent('load', window, () => {
      self.rootElement = document.querySelector('.jsroute-view');

      self.preventRootClick();
    });
  }

  private preventRootClick(): void {
    var self = this;

    eventHandler.onEvent('click', self.rootElement, (ev) => {
      if(ev.target.nodeName === "A") {
        console.log(ev);
        ev.preventDefault();
      }
    });
  }

  private urlChangeEvent() {

  }

  public onChange(callback): void {
    var self = this;
  }

  public registerPath(path: string, options: routeModel.RouteOptions): void {
    var self = this;

    self.routes.push(new routeModel.Route(path, options));
  }
}
