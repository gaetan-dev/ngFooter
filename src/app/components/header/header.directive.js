(function () {
  'use strict';

  angular
    .module('footer')
    .directive('acmeHeader', acmeHeader);

  /** @ngInject */
  function acmeHeader() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/header/header.html',
      scope: {},
      controller: HeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController() {
      var vm = this;

      /* Variables */
      vm.registerOrLogin = false;

      /* Methodes */

      /* Views */

    }
  }
})();
