(function() {
    'use strict';

    angular
        .module('footer')
		.factory('identityFactory', identityFactory); 

	function identityFactory($q, authenticationService) {
		var api = this;
		
		var _identity = undefined,
		_authenticated = false;
	
		/**
		* Return if the user identity is defined
		* method isIdentityResolved
		* @return bool
		**/
		api.isIdentityResolved = function() {
			return angular.isDefined(_identity);
		};
		
		/**
		* Return if the current user is authenticated
		* method isAuthenticated
		* @return bool
		**/
		api.isAuthenticated = function() {
			return _authenticated;
		};
		
		/**
		* Return if the user has the require level to access to the url
		* method isInAnyRole
		* @return bool
		**/
		api.isInAnyRole = function(roles) {
			if (!_authenticated || !_identity.role) { return false; }
	
			for (var i = 0; i < roles.length; i++) {
				if (this.isInRole(roles[i])) { return true; }
			}
	
			return false;
		};
		
		api.isInRole = function(role) {
			if (!_authenticated || !_identity.role) { return false; }
			return _identity.role.indexOf(role) !== -1;
		};
		
		
		api.authenticate = function(identity) {
			_identity = identity;
			_authenticated = identity !== null;
		};
		
		/**
		* Return the identity of the current user
		* method identity
		* @param force
		* @return promise {}
		**/
		api.identity = function(force) {
			var deferred = $q.defer();
	
			if (force === true) { _identity = undefined; }
	
			// check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
			if (angular.isDefined(_identity)) {
				deferred.resolve(_identity);	
				return deferred.promise;
			}
			
			authenticationService.auth()
				.then(function(data) {
					if (data.message && data.message.indexOf('Authentication required') > -1) {						
						_identity = null;
						_authenticated = false;
						deferred.resolve(_identity);
					} else {
						_identity = data;
						_authenticated = true;
						deferred.resolve(_identity);
					}
				});
	
			return deferred.promise;
		};
		
		api.getIdentity = function () {
			return _identity;
		};
		
		return api;
	}
})();
