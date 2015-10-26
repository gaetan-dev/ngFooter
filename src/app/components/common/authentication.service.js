(function () {
  'use strict';

  angular
    .module('footer')
    .service('authenticationService', authenticationService);

  /** @ngInject */
  function authenticationService($http, ENV) {
    var api = {};

    /* Methodes */
    api.login = login;
    api.logout = logout;
    api.auth = auth;


    /**
     * POST HTTP restfull
     * @method login
     * @param email
     * @param password
     * @return currentUser {}
     */
    function login(email, password) {
      return $http.post(ENV.api.URL + 'login/', {
          email: email,
          password: password
        })
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * GET HTTP restfull
     * @method logout
     * @return
     */
    function logout() {
      return $http.get(ENV.api.URL + 'logout/')
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * GET HTTP restfull
     * @method auth
     * @return currentUser {}
     */
    function auth() {
      return $http.get(ENV.api.URL + 'auth/')
        .then(function (response) {
          return response.data;
        });
    }

    return api;
  }
})();
