(function() {
  'use strict';

    angular
        .module('footer')
        .run(runBlock);
      
    /** @ngInject */
    function runBlock($log, $rootScope, identityFactory, authorizationFactory) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
              // track the state the user wants to go to; authorization service needs this
              $rootScope.toState = toState;
              $rootScope.toStateParams = toStateParams;
              // if the principal is resolved, do an authorization check immediately. otherwise,
              // it'll be done when the state it resolved.
              if (identityFactory.isIdentityResolved()) {
                  authorizationFactory.authorize();
              }
        });
        
        $log.debug('runBlock end');
    }

})();
