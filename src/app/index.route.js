/*
 * http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
 */

(function () {
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
          identity: function (authorizationFactory) {
            return authorizationFactory.authorize();
          }
        },
        data: {
          roles: []
        }
      })
      .state('accessdenied', {
        url: '/accessdenied',
        data: {
          roles: []
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
