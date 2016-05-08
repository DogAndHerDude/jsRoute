(function () {
define('utils/utils',["require", "exports"], function (require, exports) {
    "use strict";
    var urlRegex = "";
    var rootElement;
    exports.rootElement = rootElement;
    function noop() { }
    exports.noop = noop;
    function setRoot(selector) {
        rootElement = document.querySelector(selector);
    }
    exports.setRoot = setRoot;
});
//# sourceMappingURL=../../src/tmp/maps/utils/utils.js.map;
define('events/eventHandler',["require", "exports", "../utils/utils"], function (require, exports, tools) {
    "use strict";
    function broadcastEvent(eventName, eventElement, eventData) {
        var args = [].slice.call(arguments);
        var _event;
        eventName = args.shift();
        if (typeof args[args.length - 1] === 'object') {
            eventData = args.pop();
        }
        else {
            eventData = {};
        }
        if (args.length > 0) {
            eventElement = args.shift();
        }
        else {
            eventElement = window;
        }
        _event = new Event(eventName, eventData);
        eventElement.dispatchEvent(_event);
    }
    exports.broadcastEvent = broadcastEvent;
    function onEvent(eventName, eventElement, callback) {
        var args = [].slice.call(arguments);
        var cb;
        var el;
        eventName = args.shift();
        if (typeof args[args.length - 1] === "function") {
            cb = args.pop();
        }
        else {
            cb = tools.noop;
        }
        if (args.length > 0) {
            eventElement = args.shift();
        }
        else {
            eventElement = window;
        }
        eventElement.addEventListener(eventName, cb, false);
    }
    exports.onEvent = onEvent;
});
//# sourceMappingURL=../../src/tmp/maps/events/eventHandler.js.map;
define('location/location.model',["require", "exports"], function (require, exports) {
    "use strict";
    var _Location = (function () {
        function _Location(url) {
            this.href = url;
        }
        _Location.prototype.path = function () {
        };
        return _Location;
    }());
    exports._Location = _Location;
});
//# sourceMappingURL=../../src/tmp/maps/location/location.model.js.map;
define('router/router.events',["require", "exports", "../events/eventHandler", "../location/location.model", "../utils/utils"], function (require, exports, eventHandler, location_model_1, utils) {
    "use strict";
    function startRouteChange(location) {
        eventHandler.broadcastEvent("routeChange", window, location);
    }
    function interceptLinks() {
        eventHandler.onEvent('click', utils.rootElement, function (ev) {
            if (ev.target.nodeName === "A") {
                var location_1;
                ev.preventDefault();
                location_1 = new location_model_1._Location(ev.target.href);
                startRouteChange(location_1);
            }
        });
    }
    function register() {
        interceptLinks();
    }
    exports.register = register;
});
//# sourceMappingURL=../../src/tmp/maps/router/router.events.js.map;
define('route/route.observer',["require", "exports"], function (require, exports) {
    "use strict";
    var routes = [];
    function addRoute(route) {
        routes.push(route);
    }
    exports.addRoute = addRoute;
    function start() {
    }
    exports.start = start;
});
//# sourceMappingURL=../../src/tmp/maps/route/route.observer.js.map;
define('route/route.model',["require", "exports"], function (require, exports) {
    "use strict";
    var Route = (function () {
        function Route(path, options) {
            var self = this;
            self.path = path;
            self.options = options;
        }
        Route.prototype.matchRoute = function (route) {
        };
        return Route;
    }());
    exports.Route = Route;
});
//# sourceMappingURL=../../src/tmp/maps/route/route.model.js.map;
define('router/router',["require", "exports", "./router.events", "../route/route.observer", "../route/route.model", "../utils/utils"], function (require, exports, events, observer, route_model_1, utils_1) {
    "use strict";
    var Router = (function () {
        function Router(rootElement) {
            utils_1.setRoot(rootElement);
            events.register();
        }
        Router.prototype.when = function (path, options) {
            var route = new route_model_1.Route(path, options);
            observer.addRoute(route);
        };
        Router.prototype.otherwise = function (redirectTo) {
        };
        return Router;
    }());
    exports.Router = Router;
});
//# sourceMappingURL=../../src/tmp/maps/router/router.js.map;
define('index',["require", "exports", "./router/router"], function (require, exports, router_1) {
    "use strict";
    var jsRoute = router_1.Router;
    window.JSRoute = window.JSRoute || jsRoute;
});
//# sourceMappingURL=../src/tmp/maps/index.js.map;

require(["index"]);
}());