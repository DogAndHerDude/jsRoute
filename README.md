# jsRoute

A javascript router inspired by ngRoute module.

# Documentation

## Overview

### JS

```javascript
  // Instantiate a new Router
  // Provide view element that you want your app to run in

  var myRouter = new JSRoute('.jsroute-view');

  // Set up paths

  myRouter
    .when('/', {
      templateUrl: 'path/to/template',
      onLoad: function() {
      // This function will fire after the template has loaded
      }
    })
    .when('/another/:group', {
      templateUrl: 'path/to/template',
      onLoad: function() {

      }
    })
    // In case path doesn't match any of the registered routes, it redirects to a another route
    .otherwise('/');
```

### HTML

```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>My app</title>
    </head>
    <!-- The app must have a class "jsroute-app" on the root element that you want your app to run on -->
    <body class="jsroute-app">

      <!-- Declare the view element -->
      <div class="jsroute-view">

      </div>

    </body>

    <script type="text/javascript" src="jsRoute.min.js"></script>
  </html>
```

### JSRoute(selector)

Type: `Function`, Parameter: `string`, creates a new router with the given selector.

#### when(path, options)

  1. path - Type: `string`

     Route path. When a link is clicked or a browser history event is invoked (back, forward) the router emits a `routeChange` event on his root element. Supports groups, e.g.

     - `:id` all characters until the next slash will be stored in the `location` object as parameter. Example: `/group/:id` will match `/group/123456` and store the ID inside of `location` object as `id: 123456`

  2. options - Type: `object`

     Object properties:

     - `templateUrl` Type: `string`, a relative path where to find the template that should load when a path is matched.
     - `onLoad` Type: `function`, a function that is invoked after the template has been loaded into the view. The function has its own parameters: `rootElement`, `location`.

     1. onLoad rootElement - Type: `object`, the root element of the app.

     2. onLoad location - Type: `object`, the current location object.

       Object properties:

       - `hash` Type: `string`
       - `protocol` Type: `string`
       - `host` Type: `string`
       - `href` Type: `string`
       - `pathname` Type: `string`
       - `origin` Type: `string`
       - `search` Type: `string`
       - `hostname` Type: `string`
       - `matchingPath` Type: `string`
       - `params` Type: `object`
       - `path` Type: `function` Parameters: `string`, will redirect to any new path given. Checks to see if it's on the same host, if so, starts a new `routeChange` event.

#### otherwise(path)

  1. path - Type: `string`, a fallback path that the router redirects to in the case that no routes were matched.



# Building it yourself

## Requirements

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower] (http://bower.io) (`npm install -g bower`)
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)


## Setting up

1. Run `npm install`
2. Run `bower install`
3. Run `grunt` or `grunt build` to build the router
4. Run `grunt serve` to build the router & start a web server
5. Server us served on `localhost:9000`

# TODO

1. Write documentation
2. Write tests
3. Add page transition support
