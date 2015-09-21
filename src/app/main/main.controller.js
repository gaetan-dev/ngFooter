(function() {
    'use strict';
  
    angular
    .module('footer')
    .controller('MainController', MainController);
    
    /** @ngInject */
    function MainController($rootScope, user, identityFactory) {
        var vm = this;
        
        // Initialize current user with ui-router (resolve)
        // vm.user = user

        if (identityFactory.getIdentity()) {
            $rootScope.user = identityFactory.getIdentity();
        }
    }
})();
