(function () {
  'use strict';

  angular
    .module('footer')
    .service('userService', userService);

  /** @ngInject */
  function userService($http, ENV) {
    var api = {};

    /* Methodes */
    api.getUserId = getUserId;
    api.createUser = createUser;

    /**
     * GET HTTP restfull
     * @method getUserId
     * @param userId
     * @return user {}
     */
    function getUserId(userId) {
      return $http.get(ENV.api.USER_URL + userId)
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * POST HTTP restfull
     * @method createUser
     * @param user
     * @return currentUser {}
     */
    function createUser(user) {
      return $http.post(ENV.api.USER_URL, {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          role: 'User'
        })
        .then(function (response) {
          return response.data;
        });
    }

    return api;
  }
})();
