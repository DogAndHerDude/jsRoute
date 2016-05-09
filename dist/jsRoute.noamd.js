(function () {
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('utils/utils',["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var urlRegex = "";
    var rootElement;
    function noop() { }
    exports.noop = noop;
    function setRoot(selector) {
        rootElement = document.querySelector(selector);
    }
    exports.setRoot = setRoot;
    function getRoot() {
        return rootElement;
    }
    exports.getRoot = getRoot;
});
//# sourceMappingURL=../../src/tmp/maps/utils/utils.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('events/eventHandler',["require", "exports", "../utils/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var utils = require("../utils/utils");
    function broadcastEvent(eventName, eventElement, eventData) {
        var args = [].slice.call(arguments);
        var _event = new Event(eventName, eventData);
        eventElement.dispatchEvent(_event);
    }
    exports.broadcastEvent = broadcastEvent;
    function onEvent(eventName, eventElement, callback) {
        var args = [].slice.call(arguments);
        var cb = callback || utils.noop;
        var el;
        eventElement.addEventListener(eventName, cb, false);
    }
    exports.onEvent = onEvent;
});
//# sourceMappingURL=../../src/tmp/maps/events/eventHandler.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('location/location.model',["require", "exports"], factory);
    }
})(function (require, exports) {
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
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('router/router.events',["require", "exports", "../events/eventHandler", "../location/location.model", "../utils/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var eventHandler = require("../events/eventHandler");
    var location_model_1 = require("../location/location.model");
    var utils = require("../utils/utils");
    function startRouteChange(location) {
        eventHandler.broadcastEvent("routeChange", utils.getRoot(), location);
    }
    function interceptLinks() {
        eventHandler.onEvent('click', utils.getRoot(), function (ev) {
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
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('route/route.observer',["require", "exports", "../events/eventHandler", "../utils/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var eventHandler = require("../events/eventHandler");
    var utils = require("../utils/utils");
    var routes = [];
    var fallback;
    function addRoute(route) {
        routes.push(route);
    }
    exports.addRoute = addRoute;
    function addFallback(redirectTo) {
        fallback = redirectTo;
    }
    exports.addFallback = addFallback;
    function start() {
        eventHandler.onEvent("routeChange", utils.getRoot(), function (ev) {
            console.log(ev);
        });
    }
    exports.start = start;
});
//# sourceMappingURL=../../src/tmp/maps/route/route.observer.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('route/route.model',["require", "exports"], factory);
    }
})(function (require, exports) {
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
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('router/router',["require", "exports", "./router.events", "../route/route.observer", "../route/route.model", "../utils/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var events = require("./router.events");
    var observer = require("../route/route.observer");
    var route_model_1 = require("../route/route.model");
    var utils = require("../utils/utils");
    var Router = (function () {
        function Router(rootElement) {
            utils.setRoot(rootElement);
            events.register();
            observer.start();
        }
        Router.prototype.when = function (path, options) {
            var route = new route_model_1.Route(path, options);
            observer.addRoute(route);
        };
        Router.prototype.otherwise = function (redirectTo) {
            observer.addFallback(redirectTo);
        };
        return Router;
    }());
    exports.Router = Router;
});
//# sourceMappingURL=../../src/tmp/maps/router/router.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('index',["require", "exports", './router/router'], factory);
    }
})(function (require, exports) {
    'use strict';
    var router_1 = require('./router/router');
    exports.Router = router_1.Router;
});
//# sourceMappingURL=../src/tmp/maps/index.js.map;

require(["index"]);
}());