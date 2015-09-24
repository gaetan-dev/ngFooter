(function() {
    'use strict';
    
    angular
        .module('footer')
        .directive('acmePortfolio', acmePortfolio);
    
    /** @ngInject */
    function acmePortfolio() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/portfolio/portfolio.html',
            scope: {
            },
            controller: PortfolioController,
            controllerAs: 'vm',
            bindToController: true
        };
      
        return directive;
      
        /** @ngInject */
        function PortfolioController() {
      
        }
    }

})();
