(function () {
  'use strict';

  angular
    .module('footer')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, identity) {
    /* Variables */
    $rootScope.user = identity;
  }
})();
