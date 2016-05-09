"use strict";

import * as utils from '../utils/utils';

interface LocationInterface {
  protocol: string;
  host: string;
  href: string;
  path: string;
  //path(pathString: string): void;
}

class _Location implements LocationInterface {
  public protocol: string;
  public host: string;
  public href: string;
  public path: string;

  constructor(url: string) {
    //create new location object out of the given url
    var _url = URL.createObjectURL(url);
    console.log(_url);
    this.protocol = url.match(utils.protocolRegex)[0];
    this.host = url.match(utils.hostRegex)[0];
    this.path = url.match(utils.pathRegex)[0];
    this.href = url;

    console.log(this);
  }

  // Redirects to new path
  /*public path(): void {

  }*/
}

export { _Location };
