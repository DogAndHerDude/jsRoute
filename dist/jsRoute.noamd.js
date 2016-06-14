(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('events/eventHandler',["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    function broadcastEvent(eventName, element, eventData) {
        var _event;
        eventData.cancelable = true;
        _event = new CustomEvent(eventName, eventData);
        element.dispatchEvent(_event);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = broadcastEvent;
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
    'use strict';
    var protocolRegex = /\w+\:\/\//;
    exports.protocolRegex = protocolRegex;
    var hostRegex = /\w+\.\w{1,4}\//;
    exports.hostRegex = hostRegex;
    var pathRegex = /\/w+|d+$|\//;
    exports.pathRegex = pathRegex;
    var rootElement;
    var rootView;
    function noop() { return; }
    exports.noop = noop;
    function setView(selector) {
        selector = selector || '.jsroute-view';
        rootView = document.querySelector(selector);
    }
    exports.setView = setView;
    function getView() {
        return rootView;
    }
    exports.getView = getView;
    function setRoot(selector) {
        selector = selector || '.jsroute-app';
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
        define('location/location.model',["require", "exports", '../utils/utils', '../router/router.events'], factory);
    }
})(function (require, exports) {
    'use strict';
    var utils = require('../utils/utils');
    var router_events_1 = require('../router/router.events');
    var $Location = (function () {
        function $Location(url) {
            this.params = {};
            var hash = url.match(/^#*\?|$/);
            var host = url.match(utils.hostRegex);
            var protocol = url.match(utils.protocolRegex);
            var search = url.match(/^\?*$/);
            this.hash = hash ? hash[0] : '';
            this.host = host ? host[0] : window.location.host;
            this.hostname = this.host.match(/\w+/)[0];
            this.protocol = protocol ? protocol[0].replace('//', '') : window.location.protocol;
            this.origin = this.protocol + "//" + this.host;
            this.pathname = url.replace(this.protocol + '//', '').replace(this.host, '');
            this.search = search ? search[0] : '';
            this.href = "" + this.origin + this.pathname;
            this.matchingPath = '';
        }
        $Location.prototype.path = function (href) {
            router_events_1.startRouteChange(routeFactory(href));
        };
        return $Location;
    }());
    function routeFactory(url) {
        var prev = window.location;
        var next = new $Location(url);
        var locationList = { next: next, prev: prev };
        return locationList;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = routeFactory;
});
//# sourceMappingURL=../../src/tmp/maps/location/location.model.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('router/router.events',["require", "exports", '../events/eventHandler', '../location/location.model', '../utils/utils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var eventHandler_1 = require('../events/eventHandler');
    var location_model_1 = require('../location/location.model');
    var utils = require('../utils/utils');
    function onRun() {
        var view = utils.getView();
        if (view.children.length) {
            return;
        }
        startRouteChange(location_model_1.default(window.location.origin + window.location.pathname));
    }
    exports.onRun = onRun;
    function startRouteChange(location) {
        var root = utils.getRoot();
        var locationList = location;
        eventHandler_1.default('routeChange', root, { detail: locationList });
    }
    exports.startRouteChange = startRouteChange;
    function interceptLinks() {
        var root = utils.getRoot();
        root.addEventListener('click', function (ev) {
            if (ev.target.nodeName === 'A') {
                ev.preventDefault();
                startRouteChange(location_model_1.default(ev.target.href));
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
    var $history = window.history;
    var popStateInvoked = false;
    function push(route, pathname) {
        var splitTemplate = route.options.templateUrl.split('/');
        var templateName = splitTemplate.pop();
        if (!popStateInvoked) {
            $history.pushState({ path: pathname }, templateName, pathname);
        }
        popStateInvoked = false;
    }
    exports.push = push;
    function monitorBrowserNavigation() {
        window.addEventListener('popstate', function (ev) {
            ev.preventDefault();
            popStateInvoked = true;
            router_events_1.startRouteChange(location_model_1.default(ev.state.path));
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
        define('route/route.observer',["require", "exports", '../utils/utils', '../http/http', '../history/history'], factory);
    }
})(function (require, exports) {
    'use strict';
    var utils = require('../utils/utils');
    var http_1 = require('../http/http');
    var $history = require('../history/history');
    var routes = [];
    var fallback = '/';
    function monitorRouteChange() {
        var root = utils.getRoot();
        root.addEventListener('routeChange', changeCallback, false);
    }
    function insertTemplate(route, callback) {
        var isCached = route.isCached();
        var view = utils.getView();
        if (!isCached) {
            http_1.default.get(route.options.templateUrl, function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (!data) {
                    return callback();
                }
                view.innerHTML = data;
                if (route.options.cache && !isCached) {
                    route.storeTemplateToCache(data);
                }
                return callback(null, true);
            });
        }
        else {
            view.innerHTML = route.getCachedTemplate();
            return callback(null, true);
        }
    }
    function changeCallback(ev) {
        if (!ev.defaultPrevented) {
            var next = ev.detail.next;
            var prev = ev.detail.prev;
            if (next.host !== prev.host) {
                window.location.assign(next.href);
            }
            findMatch(next, function (match) {
                if (!match) {
                    return next.path(fallback);
                }
                $history.push(match, next.pathname);
                next.matchingPath = match.path;
                next.params = match.getParams(next.pathname);
                insertTemplate(match, function (err, success) {
                    if (err) {
                        return console.error(err);
                    }
                    if (!success) {
                        return console.error('No template retrieved from templateUrl');
                    }
                    if (match.options.onLoad) {
                        match.options.onLoad(utils.getRoot(), next);
                    }
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
        route.options.cache = !route.options.cache ? false : true;
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
    'use strict';
    var Route = (function () {
        function Route(path, options) {
            this.cachedTemplate = null;
            this.path = path;
            this.options = options;
        }
        Route.prototype.matchRoute = function (nextPath) {
            var splitNext = nextPath.split('/');
            var splitRoute = this.path.split('/');
            if (nextPath === '/' && nextPath === this.path) {
                return true;
            }
            if (splitRoute.length !== splitNext.length) {
                return false;
            }
            for (var i = 1, ii = splitRoute.length; i < ii; i++) {
                var rgxStr = splitNext[i] + "|\\:\\w+";
                var rgx = new RegExp(rgxStr);
                if (!rgx.test(splitRoute[i])) {
                    return false;
                }
            }
            return true;
        };
        Route.prototype.getParams = function (path) {
            var splitPath = path.split('/');
            var splitRoute = this.path.split('/');
            var params = {};
            for (var i = 1, ii = splitRoute.length; i < ii; i++) {
                var rgxParam = /:\w+/;
                if (rgxParam.test(splitRoute[i])) {
                    var paramName = splitRoute[i].replace(':', '');
                    params[paramName] = splitPath[i];
                }
            }
            return params;
        };
        Route.prototype.isCached = function () {
            return this.cachedTemplate ? true : false;
        };
        Route.prototype.storeTemplateToCache = function (template) {
            this.cachedTemplate = template;
        };
        Route.prototype.getCachedTemplate = function () {
            return this.cachedTemplate;
        };
        return Route;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Route;
});
//# sourceMappingURL=../../src/tmp/maps/route/route.model.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('route/route.provider',["require", "exports", './route.model', './route.observer'], factory);
    }
})(function (require, exports) {
    'use strict';
    var route_model_1 = require('./route.model');
    var observer = require('./route.observer');
    var provider = {
        when: function (path, options) {
            var route = new route_model_1.default(path, options);
            observer.addRoute(route);
            return this;
        },
        otherwise: function (path) {
            observer.addFallback(path);
            return this;
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = provider;
});
//# sourceMappingURL=../../src/tmp/maps/route/route.provider.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('router/router',["require", "exports", './router.events', '../route/route.observer', '../route/route.provider', '../utils/utils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var events = require('./router.events');
    var observer = require('../route/route.observer');
    var route_provider_1 = require('../route/route.provider');
    var utils = require('../utils/utils');
    var Router = (function () {
        function Router(rootElement, view) {
            utils.setRoot(rootElement);
            utils.setView(view);
        }
        Router.prototype.config = function (callback) {
            callback(route_provider_1.default);
            events.register();
            observer.start();
            events.onRun();
        };
        return Router;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Router;
});
//# sourceMappingURL=../../src/tmp/maps/router/router.js.map;
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define('JSRoute',["require", "exports", './router/router'], factory);
    }
})(function (require, exports) {
    'use strict';
    var router_1 = require('./router/router');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = router_1.default;
});
//# sourceMappingURL=../src/tmp/maps/JSRoute.js.map;
