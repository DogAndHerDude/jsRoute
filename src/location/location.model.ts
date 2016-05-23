"use strict";

import * as utils from '../utils/utils';
import * as eventHandler from "../events/eventHandler";
import { startRouteChange } from "../router/router.events";

interface URLConstructor {
    hash: string;
    search: string;
    pathname: string;
    port: string;
    hostname: string;
    host: string;
    password: string;
    username: string;
    protocol: string;
    origin: string;
    href: string;
}

interface URL {
    revokeObjectURL(url: string): void;
    createObjectURL(object: any, options?: ObjectURLOptions): string;
    new(url: string, base?: string): URLConstructor
}

declare var URL: URL;

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

class _Location implements LocationInterface {
  public protocol: string;
  public host: string;
  public href: string;
  public pathname: string;
  public hash: string;
  public origin: string;
  public search: string;
  public hostname: string;
  public matchingPath: string;

  constructor(url: string) {
    // Create new location object out of the given url
    // Change it to own instances instead of copying URL
    var _url = new URL(url);

    //this.origin = url.match(utils.originRegex);

    //console.log(url.match(utils.originRegex));

    this.hash = _url.hash;
    this.host = _url.host;
    this.hostname = _url.hostname;
    this.href = _url.href;
    this.origin = _url.origin;
    this.pathname = _url.pathname;
    this.protocol = _url.protocol;
    this.search = _url.search;
  }

  // Redirects to new path
  public path(href): void {
    startRouteChange(constructRoute(href));
  }
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
