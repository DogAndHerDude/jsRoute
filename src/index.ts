"use strict";

;(function() {
  /*
   * Interfaces
   */
  interface Window {
    gay: any;
  }

  interface RouteOptions {
    templateUrl: string;
  }

  interface RouteProvider {
    when(path: string, options: RouteOptions): void;
  }

  class jsRoute implements RouteProvider {
    private routes: Array<any>;

    public when(path: string, options: RouteOptions): void {

    }
  }

  window['jsRoute'] = window['jsRoute'] || new jsRoute();
})();
