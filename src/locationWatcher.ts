"use strict";

import * as routeModel from "./route.model";

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

    window.addEventListener('load', () => {
      self.rootElement = document.querySelector('.jsroute-view');

      self.preventRootClick();
    }, false);
  }

  private preventRootClick(): void {
    var self = this;

    self.rootElement.addEventListener('click', (ev) => {
      if(ev.target.nodeName === "A") {
        ev.preventDefault();
      }
    }, false);
  }

  private broadcastEvent(eventName:string, eventData): void {
    var ev = new Event(eventName);
  }

  public onChange(callback): void {
    var self = this;
  }

  public registerPath(path: string, options: routeModel.RouteOptions): void {
    var self = this;

    self.routes.push(new routeModel.Route(path, options));
  }
}
