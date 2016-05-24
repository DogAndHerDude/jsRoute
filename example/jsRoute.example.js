'use strict';

(function() {
  var myRouter = new JSRoute('.jsroute-app', '.jsroute-view');

  myRouter.config(function(routeProvider) {
    routeProvider
      .when('/', {
        templateUrl: '/views/main.view.html',
        onLoad: function(rootElement, location) {
          var nextViewButton = rootElement.querySelector('.next-view');

          nextViewButton.addEventListener('click', function() {
            console.log('main loaded');
            location.path('/groups/123456');
          });
        }
      }).when('/groups/:id', {
        templateUrl: '/views/groupSingle.view.html',
        onLoad: function(rootElement, location) {
          var title = rootElement.querySelector('.group-name')

          title.innerHTML = title.innerHTML + ' ' + location.params.id;
        }
      })
      .when('/page2', {
        templateUrl: '/views/page.view.html',
        onLoad: function(rootElement, location) {
          
        }
      }).otherwise('/');
  });
})();
