'use strict';

(function() {
  var myRouter = new JSRoute('.jsroute-app', '.jsroute-view');

  myRouter.config(function(routeProvider) {
    routeProvider
      .when('/', {
        templateUrl: '/views/main.view.html',
        onLoad: function() {
        }
      }).when('/groups/:group', {
        templateUrl: '/views/group.view.html',
        onLoad: function(view, rootElement, location) {
        }
      }).when('/group/:id', {
        templateUrl: 'url',
        onLoad: function() {

        }
      }).when('/group', {
        templateUrl: '/views/groupSingle.view.html',
        onLoad: function() {

        }
      }).otherwise('/');
  });
})();
