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

  public matchRoute(nextPath: string): boolean {
    var self = this;
    var splitNext = nextPath.split('/');
    var splitRoute = self.path.split('/');

    if(nextPath === '/' && nextPath === self.path) return true;
    if(splitRoute.length !== splitNext.length) return false;

    for(var i = 1, ii = splitRoute.length; i < ii; i++) {
      let rgxStr = `${splitNext[i]}|\\:\\w+`;
      let rgx = new RegExp(rgxStr);

      if(!rgx.test(splitRoute[i])) return false;
    }

    return true;
  }

  public getParams(path: string): Object {
    var self = this;
    var splitPath = path.split('/');
    var splitRoute = self.path.split('/');
    var params = {};

    for(var i = 1, ii = splitRoute.length; i < ii; i++) {
      let rgxParam = /:\w+/;

      if(rgxParam.test(splitRoute[i])) {
        let paramName = splitRoute[i].replace(':', '');
        params[paramName] = splitPath[i];
      }
    }

    return params;
  }
}

export { RouteOptions };
export { Route };
