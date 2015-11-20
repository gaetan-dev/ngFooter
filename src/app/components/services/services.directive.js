(function () {
  'use strict';

  angular
    .module('footer')
    .directive('acmeServices', acmeServices);

  /** @ngInject */
  function acmeServices() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/services/services.html',
      scope: {},
      controller: ServicesController,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function ServicesController($timeout, availabilitiesModalService, organizeModalService, matchesModalService) {
      var vm = this;

      /* Variables */
      var buttonClicked = false;

      /* Methodes */
      vm.clickOnAvailabilities = clickOnAvailabilities;
      vm.clickOnOrganize = clickOnOrganize;
      vm.clickOnMatches = clickOnMatches;

      /**
       * Action when the user click on the availabilities button
       * Show the availabilities modal
       * @method clickOnAvailabilities
       */
      function clickOnAvailabilities() {
        if (!buttonClicked) {
          clickOnService();
          availabilitiesModalService.showAvailabilities();
        }
      }

      /**
       * Action when the user click on the organize button
       * Show the organize modal
       * @method clickOnOrganize
       */
      function clickOnOrganize() {
        if (!buttonClicked) {
          clickOnService();
          organizeModalService.showOrganize();
        }
      }

      /**
       * Action when the user click on the matches button
       * Show the organize modal
       * @method clickOnMatches
       */
      function clickOnMatches() {
        if (!buttonClicked) {
          clickOnService();
          matchesModalService.showMatches();
        }
      }

      function clickOnService() {
        buttonClicked = true;
        $timeout(function () {
          buttonClicked = false;
        }, 1000);
      }
    }
  }
})();
