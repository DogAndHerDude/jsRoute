# jsRoute

A javascript router inspired by ngRoute module.

# Usage

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
