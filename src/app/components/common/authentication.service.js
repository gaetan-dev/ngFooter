(function() {
    'use strict';

    angular
        .module('footer')
		.service('authenticationService', authenticationService); 
      
    /** @ngInject */  
    function authenticationService($http, ENV) {
        var api = {};            
         
        /**
         * POST HTTP restfull
         * @method login
         * @param email
         * @param password
         * @return currentUser
         */ 
        api.login = function (email, password) {
		    return $http.post(ENV.api.URL + 'login/', {
                email: email,
                password: password
            })
            .then(function (response) {
                return response.data;
            });
		};
		
		/**
         * GET HTTP restfull
         * @method logout
         * @return user
         */ 
		api.logout = function () {
			return $http.get(ENV.api.URL + 'logout/')
			.then(function (response) {
                return response.data;
            });
		};
        
        /**
         * GET HTTP restfull
         * @method auth
         * @return user
         */ 
		api.auth = function () {
			return $http.get(ENV.api.URL + 'auth/')
                .then(function (response) {
                    return response.data;
                });
		};
        
        return api;
    }
})();
