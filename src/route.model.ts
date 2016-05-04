"use strict";

interface RouteOptions {
  templateUrl: string;
  template: string;
  onLoad(callback: (location: Object) => void): void;
}

class Route {
  public path: string;
  public options: RouteOptions;

  constructor(path: string, options: RouteOptions) {
    var self = this;

    self.path = path;
    self.options = options;
  }
}

export { RouteOptions };
export { Route };
