(function() {
  'use strict';

  angular
    .module('footer')
    .directive('acmeContact', acmeContact);

  /** @ngInject */
  function acmeContact() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/contact/contact.html',
      scope: {
          creationDate: '='
      },
      controller: ContactController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function ContactController() {
        
    }
  }

})();
