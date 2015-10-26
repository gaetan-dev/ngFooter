/* global angular */
(function () {
  'use strict';

  angular
    .module('footer')
    .directive('acmeEvents', acmeEvents);

  /** @ngInject */
  function acmeEvents() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/events/events.html',
      scope: {},
      controller: EventsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function EventsController() {

    }
  }

})();
