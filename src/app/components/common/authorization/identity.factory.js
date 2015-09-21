(function() {
    'use strict';

    angular
        .module('footer')
		.factory('identityFactory', identityFactory); 

	function identityFactory($q, authenticationService) {
		var api = this;
		
		var _identity = undefined,
		_authenticated = false;
	
		api.isIdentityResolved = function() {
			return angular.isDefined(_identity);
		},
		
		api.isAuthenticated = function() {
			return _authenticated;
		},
		
		api.isInRole =function(role) {
			if (!_authenticated || !_identity.roles) { return false; }
			return _identity.roles.indexOf(role) !== -1;
		},
		
		api.isInAnyRole = function(roles) {
			if (!_authenticated || !_identity.roles) { return false; }
	
			for (var i = 0; i < roles.length; i++) {
				if (this.isInRole(roles[i])) { return true; }
			}
	
			return false;
		},
		
		api.authenticate = function(identity) {
			_identity = identity;
			_authenticated = identity !== null;
		},
		
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
