/* global angular */
/* global toastr:false, moment:false */
(function() {
    'use strict';
  
    angular
        .module('footer')
        .constant('toastr', toastr)
        .constant('moment', moment);

})();
