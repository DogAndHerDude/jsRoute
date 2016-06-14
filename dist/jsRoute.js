(function(global) {
/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../node_modules/almond/almond", function(){});

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
        var cachedTemplate = route.getCachedTemplate();
        var view = utils.getView();
        if (!cachedTemplate) {
            http_1.default.get(route.options.templateUrl, function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (!data) {
                    return callback();
                }
                view.innerHTML = data;
                if (route.options.cache && !cachedTemplate) {
                    route.setCachedTemplate(data);
                }
                return callback(null, true);
            });
        }
        else {
            view.innerHTML = cachedTemplate;
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
        Route.prototype.getCachedTemplate = function () {
            return this.cachedTemplate;
        };
        Route.prototype.setCachedTemplate = function (template) {
            this.cachedTemplate = template;
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
        define('index',["require", "exports", './router/router'], factory);
    }
})(function (require, exports) {
    'use strict';
    var router_1 = require('./router/router');
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = router_1.default;
});
//# sourceMappingURL=../src/tmp/maps/index.js.map;
global.JSRoute = global.JSRoute || require("index").default; }(window));
