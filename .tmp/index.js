"use strict";
;
(function () {
    var noop = function () { return null; };
    var routes = [];
    var Route = (function () {
        function Route(path, options) {
            var self = this;
            self.path = path;
            self.options = options;
        }
        return Route;
    }());
    var LocationWatcher = (function () {
        function LocationWatcher() {
            var self = this;
            self.registerListeners();
        }
        LocationWatcher.prototype.registerListeners = function () {
            var self = this;
            window.addEventListener('load', function () {
                self.history = window.history;
                self.location = window.location;
                self.rootElement = document.querySelector('.jsroute-view');
                self.preventRootClick();
            }, false);
        };
        LocationWatcher.prototype.preventRootClick = function () {
            var self = this;
            self.rootElement.addEventListener('click', function (ev) {
                if (ev.target.nodeName === "A") {
                    ev.preventDefault();
                }
            }, false);
        };
        LocationWatcher.prototype.updateURL = function () {
        };
        LocationWatcher.prototype.onChange = function (callback) {
            var self = this;
        };
        return LocationWatcher;
    }());
    function run() {
        var jsRoute = {};
        var watcher = new LocationWatcher();
        watcher.onChange(function (ev) {
            console.log(ev);
            ev.preventDefault();
        });
        history.pushState({ foo: 'bar' }, "page2", "index.html");
        window.onpopstate = function (ev) {
            console.log(ev);
        };
        function when(path, options) {
            routes.push(new Route(path, options));
        }
        return jsRoute;
    }
    var jsRoute = run();
    window['jsRoute'] = window['jsRoute'] || jsRoute;
})();
//# sourceMappingURL=../src/tmp/maps/index.js.map