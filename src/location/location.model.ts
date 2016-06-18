'use strict';

import * as utils from '../utils/utils';
import { startRouteChange } from '../router/router.events';

export class LocationModel {
  public hash: string;
  public host: string;
  public hostname: string;
  public protocol: string;
  public origin: string;
  public pathname: string;
  public search: string;
  public href: string;
  public matchingPath: string;
  public params: Object = {};

  constructor(url: string) {
    let hash: RegExpMatchArray = url.match(/^#*\?|$/);
    let host: RegExpMatchArray = url.match(utils.hostRegex);
    let protocol: RegExpMatchArray = url.match(utils.protocolRegex);
    let search: RegExpMatchArray = url.match(/^\?*$/);

    this.hash = hash ? hash[0] : '';
    this.host = host ? host[0] : window.location.host;
    this.hostname = this.host.match(/\w+/)[0];
    this.protocol = protocol ? protocol[0].replace('//', '') : window.location.protocol;
    this.origin = `${this.protocol}//${this.host}`;
    this.pathname = url.replace(this.protocol + '//', '').replace(this.host, '');
    this.search = search ? search[0] : '';
    this.href = `${this.origin}${this.pathname}`;
    this.matchingPath = '';
  }

  public path(href: string): void {
    startRouteChange(href);
  }
}

export default LocationModel;
