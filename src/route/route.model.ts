'use strict';

import RouteInterface from '../typings/route/route.d';

class Route {
  public path: string;
  public options: RouteInterface.RouteOptions;
  private cachedTemplate: string | void = null;

  constructor(path: string, options: RouteInterface.RouteOptions) {
    this.path = path;
    this.options = options;
  }

  public matchRoute(nextPath: string): boolean {
    var splitNext = nextPath.split('/');
    var splitRoute = this.path.split('/');

    if (nextPath === '/' && nextPath === this.path) { return true; }
    if (splitRoute.length !== splitNext.length) { return false; }

    for (var i = 1, ii = splitRoute.length; i < ii; i++) {
      let rgxStr = `${splitNext[i]}|\\:\\w+`;
      let rgx = new RegExp(rgxStr);

      if (!rgx.test(splitRoute[i])) { return false; }
    }

    return true;
  }

  public getParams(path: string): Object {
    var splitPath = path.split('/');
    var splitRoute = this.path.split('/');
    var params = {};

    for (var i = 1, ii = splitRoute.length; i < ii; i++) {
      let rgxParam = /:\w+/;

      if (rgxParam.test(splitRoute[i])) {
        let paramName = splitRoute[i].replace(':', '');
        params[paramName] = splitPath[i];
      }
    }

    return params;
  }

  public getCachedTemplate(): string | void {
    return this.cachedTemplate;
  }

  public setCachedTemplate(template: string | void) {
    this.cachedTemplate = template;
  }
}

export default Route;
