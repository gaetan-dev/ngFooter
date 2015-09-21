(function() {
    'use strict';
    
    angular
        .module('footer')
        .directive('acmeServices', acmeServices);
        
    /** @ngInject */
    function acmeServices() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/services/services.html',
            scope: {
            },
            controller: ServicesController,
            controllerAs: 'vm',
            bindToController: true,
        };
        
        return directive;
        
        /** @ngInject */
        function ServicesController(availabilitiesModalService, organizeModalService) {
            var vm = this;
            
            /* Methodes */
            vm.clickOnAvailabilities = clickOnAvailabilities;
            vm.clickOnOrganize = clickOnOrganize;
            
            // Modal Availabilities  
            function clickOnAvailabilities () {
                availabilitiesModalService.showAvailabilities();
            }
            
            // Modal Organize
            function clickOnOrganize () {
                organizeModalService.showOrganize();
            }
        }
    }
})();
