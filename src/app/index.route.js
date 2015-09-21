(function() {
  'use strict';

  angular
    .module('footer')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        resolve: {
          user: function(authenticationService) {
            return authenticationService.auth();
          }
        }
      });
    $urlRouterProvider.otherwise('/');
  }

})();