(function () {
  'use strict';

  angular
    .module('footer')
    .directive('acmeCardUI', acmeCardUI);

  /** @ngInject */
  function acmeCardUI() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/common/cardUI/cardUI.html',
      scope: {
        event: '='
      },
      controller: CardUIController,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    /** @ngInject */
    function CardUIController(moment) {
      var vm = this;
      /* Attributes */
      vm.date = moment(vm.event.date);

      /* Methodes */

    }
  }
})();
