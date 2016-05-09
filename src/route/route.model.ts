"use strict";

interface RouteOptions {
  templateUrl: string;
  template: string;
  onLoad(callback: (location: Object) => void): void;
  matchRoute(route: Object): void;
}

interface CallbackInterface {
  (match: Object): any;
}

class Route {
  public path: string;
  public options: RouteOptions;

  constructor(path: string, options: RouteOptions) {
    var self = this;

    self.path = path;
    self.options = options;
  }

  public matchRoute(splitRoute: Array<string>, callback: CallbackInterface): void {
    var self = this;
    var selfSplitRoute = self.path.split('/');

    //Start checking for matches
  }
}

export { RouteOptions };
export { Route };
