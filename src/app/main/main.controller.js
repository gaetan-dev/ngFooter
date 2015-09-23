(function() {
    'use strict';
  
    angular
    .module('footer')
    .controller('MainController', MainController);
    
    /** @ngInject */
    function MainController($rootScope, identity) {
        var vm = this;
        
        // Initialize current user with ui-router (resolve)
        // vm.user = user

        $rootScope.user = identity;
    }
})();
