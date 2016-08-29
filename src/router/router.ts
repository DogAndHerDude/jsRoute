'use strict';

import RouteInterface from '../typings/route/route.d';

import * as events from './router.events';
import * as observer from '../route/route.observer';
import routeProvider from '../route/route.provider';
import * as utils from '../utils/utils';

class Router {
  constructor(rootElement, view) {
    utils.setRoot(rootElement);
    utils.setView(view);
  }

  public config(callback: (routeProvider: RouteInterface.RouteProvider) => void): void {
    callback(routeProvider);
    
    observer.start();
    events.onRun();
  }
}

export default Router;
