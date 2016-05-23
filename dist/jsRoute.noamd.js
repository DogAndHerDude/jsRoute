(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('utils/utils',["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var originRegex = /\w+:\/\//;
    exports.originRegex = originRegex;
    var hostRegex = /\w+\.\w{1,3}\//;
    exports.hostRegex = hostRegex;
    var pathRegex = /\/w+|d+$|\//;
    exports.pathRegex = pathRegex;
    var rootElement;
    var rootView;
    function noop() { }
    exports.noop = noop;
    function setView(selector) {
        rootView = document.querySelector(selector);
    }
    exports.setView = setView;
    function getView() {
        return rootView;
    }
    exports.getView = getView;
    function setRoot() {
        rootElement = document.querySelector('.jsroute-app');
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
    function broadcastEvent(eventName, eventData) {
        var args = [].slice.call(arguments);
        var _event;
        eventData.cancelable = true;
        _event = new CustomEvent(eventName, eventData);
        this.dispatchEvent(_event);
    }
    function onEvent(eventName, eventElement, callback) {
        var args = [].slice.call(arguments);
        var cb = callback || utils.noop;
        var el;
        eventElement.addEventListener(eventName, cb, false);
    }
    exports.onEvent = onEvent;
    function extendRoot() {
        Object.prototype['broadcastEvent'] = broadcastEvent;
    }
    exports.extendRoot = extendRoot;
});
//# sourceMappingURL=../../src/tmp/maps/events/eventHandler.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('location/location.model',["require", "exports", "../router/router.events"], factory);
    }
})(function (require, exports) {
    "use strict";
    var router_events_1 = require("../router/router.events");
    var _Location = (function () {
        function _Location(url) {
            var _url = new URL(url);
            this.hash = _url.hash;
            this.host = _url.host;
            this.hostname = _url.hostname;
            this.href = _url.href;
            this.origin = _url.origin;
            this.pathname = _url.pathname;
            this.protocol = _url.protocol;
            this.search = _url.search;
        }
        _Location.prototype.path = function (href) {
            router_events_1.startRouteChange(constructRoute(href));
        };
        return _Location;
    }());
    function constructRoute(href) {
        var prev = window.location;
        var next = new _Location(href);
        return { next: next, prev: prev };
    }
    exports.constructRoute = constructRoute;
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
    function onRun() {
        startRouteChange(location_model_1.constructRoute(window.location.origin + window.location.pathname));
    }
    exports.onRun = onRun;
    function startRouteChange(location) {
        var root = utils.getRoot();
        root.broadcastEvent("routeChange", { detail: location });
    }
    exports.startRouteChange = startRouteChange;
    function interceptLinks() {
        var root = utils.getRoot();
        root.addEventListener('click', function (ev) {
            if (ev.target.nodeName === "A") {
                ev.preventDefault();
                startRouteChange(location_model_1.constructRoute(ev.target.href));
            }
        });
    }
    function register() {
        eventHandler.extendRoot();
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
        define('http/http',["require", "exports", '../utils/utils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var utils_1 = require('../utils/utils');
    var $http = {
        get: function (url, callback) {
            var cb = callback || utils_1.noop;
            var req = new XMLHttpRequest();
            req.onreadystatechange = xhrCb;
            req.open('GET', url);
            req.send();
            function xhrCb() {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === 200) {
                        cb(null, req.responseText);
                    }
                    else {
                        cb(req.status);
                    }
                }
            }
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = $http;
});
//# sourceMappingURL=../../src/tmp/maps/http/http.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('route/route.observer',["require", "exports", "../utils/utils", "../http/http"], factory);
    }
})(function (require, exports) {
    "use strict";
    var utils = require("../utils/utils");
    var http_1 = require("../http/http");
    var routes = [];
    var fallback = window.location.origin + "/";
    var pageIndex = 0;
    function monitorRouteChange() {
        var root = utils.getRoot();
        root.addEventListener('routeChange', changeCallback, false);
    }
    function changeCallback(ev) {
        if (!ev.defaultPrevented) {
            var next = ev.detail.next;
            var prev = ev.detail.prev;
            if (next.host !== prev.host)
                window.location.assign(next.href);
            findMatch(next, function (match) {
                if (!match)
                    return next.path(fallback);
                history.pushState({ path: match.path }, 'page', next.pathname);
                next.matchingPath = match.path;
                http_1.default.get(match.options.templateUrl, function (err, data) {
                    var view = utils.getView();
                    view.innerHTML = data;
                    if (match.options.onLoad)
                        match.options.onLoad(view, utils.getRoot(), next);
                });
            });
        }
    }
    function findMatch(next, callback) {
        for (var i = 0, ii = routes.length; i < ii; i++) {
            if (routes[i].matchRoute(next.pathname)) {
                return callback(routes[i]);
            }
        }
        return callback();
    }
    function addRoute(route) {
        routes.push(route);
    }
    exports.addRoute = addRoute;
    function addFallback(redirectTo) {
        fallback = window.location.origin + redirectTo;
    }
    exports.addFallback = addFallback;
    function start() {
        monitorRouteChange();
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
        Route.prototype.matchRoute = function (nextPath) {
            var self = this;
            var splitNext = nextPath.split('/');
            var splitRoute = self.path.split('/');
            if (nextPath === '/' && nextPath === self.path)
                return true;
            if (splitRoute.length !== splitNext.length)
                return false;
            for (var i = 1, ii = splitRoute.length; i < ii; i++) {
                var rgxStr = splitNext[i] + "|\\:\\w+";
                var rgx = new RegExp(rgxStr);
                if (!rgx.test(splitRoute[i]))
                    return false;
            }
            return true;
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
        function Router(view) {
            utils.setView(view);
            utils.setRoot();
            events.register();
        }
        Router.prototype.when = function (path, options) {
            var route = new route_model_1.Route(path, options);
            observer.addRoute(route);
            return this;
        };
        Router.prototype.otherwise = function (redirectTo) {
            observer.addFallback(redirectTo);
            observer.start();
            events.onRun();
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
