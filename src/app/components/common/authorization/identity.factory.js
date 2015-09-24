(function() {
    'use strict';

    angular
        .module('footer')
		.factory('identityFactory', identityFactory); 

	function identityFactory ($q, authenticationService) {
		var api = this;
		
		/* Variables */
		var _identity;
		var _authenticated = false;
		
		/* Methodes */
		api.isIdentityResolved = isIdentityResolved;
		api.isAuthenticated = isAuthenticated;
		api.isInAnyRole = isInAnyRole;
		api.authenticate = authenticate;
		api.identity = identity;
		api.getIdentity = getIdentity;
		
	
		/**
		 * Return if the user identity is defined
		 * @method isIdentityResolved
		 * @return bool
		 */
		function isIdentityResolved () {
			return angular.isDefined(_identity);
		}
		
		/**
		 * Return if the current user is authenticated
		 * @method isAuthenticated
		 * @return bool
		 */
		function isAuthenticated () {
			return _authenticated;
		}
		
		/**
		 * Return if the user has the require level to access to the url
		 * @method isInAnyRole
		 * @return bool
		 */
		function isInAnyRole (roles) {
			if (!_authenticated || !_identity.role) { return false; }
	
			for (var i = 0; i < roles.length; i++) {
				if (isInRole(roles[i])) { return true; }
			}
	
			return false;
		}
		
		/**
		 * @method isInRole
		 * @param role 
		 * @return bool
		 */
		function isInRole (role) {
			if (!_authenticated || !_identity.role) { return false; }
			return _identity.role.indexOf(role) !== -1;
		}
		
		/**
		 * Assign values to _identity and _authenticatie
		 * @method authenticate
		 * @param identity
		 */
		function authenticate (identity) {
			_identity = identity;
			_authenticated = identity !== null;
		}
		
		/**
		 * Authenticate the current user
		 * @method identity
		 * @param force
		 * @return promise {}
		 */
		function identity (force) {
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
		}
		
		/**
		 * Return the identity of the current user
		 * @method getIdentity
		 * @return _identity {}
		 */
		function getIdentity () {
			return _identity;
		}
		
		return api;
	}
})();
