(function() {
    'use strict';
  
    angular
    .module('footer')
    .controller('MainController', MainController);
    
    /** @ngInject */
    function MainController($rootScope, user) {
        var vm = this;
        
        // Initialize current user with ui-router (resolve)
        // vm.user = user
        if (user.id) {
            $rootScope.user = user;
        }
    }
})();
