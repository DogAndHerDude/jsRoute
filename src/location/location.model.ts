"use strict";

import * as utils from '../utils/utils';
import * as eventHandler from "../events/eventHandler";
import { startRouteChange } from "../router/router.events";

interface LocationInterface {
  protocol: string;
  host: string;
  href: string;
  pathname: string;
  hash: string;
  origin: string;
  search: string;
  hostname: string;
  matchingPath: string;
  path(pathString: string): void;
}

class $Location implements LocationInterface {
  public hash: string;
  public host: string;
  public hostname: string;
  public protocol: string;
  public origin: string;
  public pathname: string;
  public search: string;
  public href: string;
  public matchingPath: string;

  constructor(url) {
    this.hash = url.match(/^#*\?|$/) || '';
    this.host = url.match(utils.hostRegex) || window.location.host;

    if(typeof this.host === 'object') {
      this.host = this.protocol[0];
    }

    this.hostname = this.host.match(/\w+/)[0];

    this.protocol = url.match(utils.protocolRegex) || window.location.protocol;

    if(typeof this.protocol === 'object') {
      this.protocol = this.protocol[0];
      this.protocol = this.protocol.replace('//', '');
    }

    this.origin = `${this.protocol}//${this.host}`;
    this.pathname = url.replace(this.protocol + '//', '').replace(this.host, '');
    this.search = url.match(/^\?*$/) || '';
    this.href = `${this.origin}${this.pathname}`;
    this.matchingPath = '';
  }

  public path(href: string): void {
    startRouteChange(constructRoute(href));
  }
}

function constructRoute(href) {
  var prev = window.location;
  var next = new $Location(href);

  return {next, prev};
}

export { constructRoute };
export { $Location }
