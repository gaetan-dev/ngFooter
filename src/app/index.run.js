(function() {
  'use strict';

  angular
    .module('footer')
    .run(runBlock);
    
  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
