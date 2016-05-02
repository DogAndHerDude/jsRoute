"use strict";

;(function() {

  var noop = function() { return null; }

  interface RouteOptions {
    templateUrl: string;
    //onLoad(): void;
  }

  class Route {
    public path: string;
    public options: RouteOptions;

    constructor(path: string, options: RouteOptions) {
      var self = this;

      self.path = path;
      self.options = options;
    }
  }

  class LocationWatcher {
    private location;
    private history;
    private routes: Array<Route>;
    private rootElement;

    constructor() {
      var self = this;

      self.history = window.history;
      self.location = window.location;

      self.registerListeners();
    }

    private registerListeners(): void {
      var self = this;

      window.addEventListener('load', () => {
        self.rootElement = document.querySelector('.jsroute-view');

        self.preventRootClick();
      }, false);
    }

    private preventRootClick(): void {
      var self = this;

      self.rootElement.addEventListener('click', (ev) => {
        if(ev.target.nodeName === "A") {
          ev.preventDefault();
        }
      }, false);
    }

    private updateURL() {

    }

    public onChange(callback): void {
      var self = this;
    }
  }

  function run() {
    var jsRoute = {};
    var watcher = new LocationWatcher();

    watcher.onChange(function(ev) {
      ev.preventDefault();
    });

    function when(path: string, options: RouteOptions) {
      routes.push(new Route(path, options));
    }

    jsRoute.when = when;

    return jsRoute;
  }

  let jsRoute = run();

  window['jsRoute'] = window['jsRoute'] || jsRoute;
})();
