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
            return authorizationFactory.authorize('home');
          }
        },
        data: {
          roles: []
        }
      })
      .state('admin', {
          url: '/admin',
          templateUrl: 'app/admin/admin.html',
          controller: 'AdminController',
          controllerAs: 'admin',
          resolve: {
            identity: function (authorizationFactory) {
              return authorizationFactory.authorize('admin');
            },
            users: function (userService) {
              return userService.getAllUsers();
            }
          },
          data: {
            roles: ['Admin']
          }
      })
      .state('accessdenied', {
        url: '/accessdenied'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
