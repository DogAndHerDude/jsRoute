"use strict";

export interface RouteOptions {
  templateUrl: string;
  //onLoad(): void;
}

export class Route {
  public path: string;
  public options: RouteOptions;

  constructor(path: string, options: RouteOptions) {
    var self = this;

    self.path = path;
    self.options = options;
  }
}
