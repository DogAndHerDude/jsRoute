"use strict";

interface RouteOptions {
  templateUrl: string;
  template: string;
  onLoad(callback: (location: Object) => void): void;
  matchRoute(route: Object): void;
}

class Route {
  public path: string;
  public options: RouteOptions;

  constructor(path: string, options: RouteOptions) {
    var self = this;

    self.path = path;
    self.options = options;
  }

  public matchRoute(nextPath): boolean {
    var self = this;
    var splitNext = nextPath.split('/');
    var splitRoute = self.path.split('/');

    if(nextPath === '/' && nextPath === self.path) {
      return true;
    }
    if(splitRoute.length !== splitNext.length) return false;
  }
}

export { RouteOptions };
export { Route };
