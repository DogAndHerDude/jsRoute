(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('events/eventHandler',["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function broadcastEvent(eventName, eventData) {
        var args = [].slice.call(arguments);
        var _event;
        eventData.cancelable = true;
        _event = new CustomEvent(eventName, eventData);
        this.dispatchEvent(_event);
    }
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
        define('utils/utils',["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var protocolRegex = /\w+\:\/\//;
    exports.protocolRegex = protocolRegex;
    var hostRegex = /\w+\.\w{1,4}\//;
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
        define('location/location.model',["require", "exports", '../utils/utils', "../router/router.events"], factory);
    }
})(function (require, exports) {
    "use strict";
    var utils = require('../utils/utils');
    var router_events_1 = require("../router/router.events");
    var $Location = (function () {
        function $Location(url) {
            this.hash = url.match(/^#*\?|$/) || '';
            this.host = url.match(utils.hostRegex) || window.location.host;
            if (typeof this.host === 'object') {
                this.host = this.host[0];
            }
            this.hostname = this.host.match(/\w+/)[0];
            this.protocol = url.match(utils.protocolRegex) || window.location.protocol;
            if (typeof this.protocol === 'object') {
                this.protocol = this.protocol[0];
                this.protocol = this.protocol.replace('//', '');
            }
            this.origin = this.protocol + "//" + this.host;
            this.pathname = url.replace(this.protocol + '//', '').replace(this.host, '');
            this.search = url.match(/^\?*$/) || '';
            this.href = "" + this.origin + this.pathname;
            this.matchingPath = '';
        }
        $Location.prototype.path = function (href) {
            router_events_1.startRouteChange(constructRoute(href));
        };
        return $Location;
    }());
    exports.$Location = $Location;
    function constructRoute(href) {
        var prev = window.location;
        var next = new $Location(href);
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
        define('history/history',["require", "exports", '../router/router.events', '../location/location.model'], factory);
    }
})(function (require, exports) {
    'use strict';
    var router_events_1 = require('../router/router.events');
    var location_model_1 = require('../location/location.model');
    var $history = [];
    var $$history = window.history;
    var currentIndex = -1;
    function push(route, pathname) {
        var splitTemplate = route.options.templateUrl.split('/');
        var templateName = splitTemplate.pop();
        if ($history[currentIndex - 1] === pathname) {
            currentIndex--;
        }
        else if ($history[currentIndex + 1] === pathname) {
            currentIndex++;
        }
        else {
            $history.push(pathname);
            currentIndex = $history.length - 1;
            $$history.pushState({ path: pathname }, templateName, pathname);
        }
    }
    exports.push = push;
    function monitorBrowserNavigation() {
        window.addEventListener('popstate', function (ev) {
            ev.preventDefault();
            router_events_1.startRouteChange(location_model_1.constructRoute(ev.state.path));
        });
    }
    exports.monitorBrowserNavigation = monitorBrowserNavigation;
});
//# sourceMappingURL=../../src/tmp/maps/history/history.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('route/route.observer',["require", "exports", "../utils/utils", "../http/http", '../history/history'], factory);
    }
})(function (require, exports) {
    "use strict";
    var utils = require("../utils/utils");
    var http_1 = require("../http/http");
    var $history = require('../history/history');
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
                $history.push(match, next.pathname);
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
        $history.monitorBrowserNavigation();
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
