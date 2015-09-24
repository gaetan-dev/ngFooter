
(function() {
    'use strict';
    
    angular
        .module('footer')
        .directive('acmeAbout', acmeAbout);
    
    /** @ngInject */
    function acmeAbout () {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/about/about.html',
            scope: {
            },
            controller: AboutController,
            controllerAs: 'vm',
            bindToController: true
        };
    
        return directive;
    
        /** @ngInject */
        function AboutController () {
        
        }
    }   

})();
