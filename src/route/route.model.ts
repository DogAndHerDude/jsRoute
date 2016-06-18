'use strict';

import RouteInterface from '../typings/route/route.d';
import LocationInterface from '../typings/location/location.d';

class RouteOptions implements RouteInterface.RouteOptions {
  public templateUrl: string | void = null;
  public template: string | void = null;
  public cache: boolean = false;
  public onLoad: (rootElement: Object, location: LocationInterface.LocationModel) => void | void = null;

  constructor(options: RouteInterface.RouteOptions) {
    this.templateUrl = options.templateUrl ? options.templateUrl : this.templateUrl;
    this.template = options.template ? options.template : this.template;
    this.cache = options.cache ? options.cache : this.cache;
    this.onLoad = options.onLoad ? options.onLoad : this.onLoad;
  }
}

class Route {
  public path: string;
  public options: RouteInterface.RouteOptions;
  private cachedTemplate: string | void = null;

  constructor(path: string, options: RouteInterface.RouteOptions) {
    this.path = path;
    this.options = new RouteOptions(options);
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
