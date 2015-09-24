/* global angular */
(function() {
    'use strict';
  
    angular
        .module('footer')
        .directive('acmeNavbar', acmeNavbar);
  
    /** @ngInject */
    function acmeNavbar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {
            },
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true
        };
    
        return directive;
    
        /** @ngInject */
        function NavbarController() {
    
        }
    }
})();


