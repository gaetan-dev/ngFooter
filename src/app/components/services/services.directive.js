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
            
            /**
             * Action when the user click on the availabilities button
             * Show the availabilities modal
             * @method clickOnAvailabilities
             */  
            function clickOnAvailabilities () {
                availabilitiesModalService.showAvailabilities();
            }
            
             /**
              * Action when the user click on the organize button
              * Show the organize modal
              * @method clickOnOrganize
              */ 
            function clickOnOrganize () {
                organizeModalService.showOrganize();
            }
        }
    }
})();
