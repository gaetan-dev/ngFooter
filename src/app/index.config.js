(function() {
    'use strict';
  
    angular
        .module('footer')
        .config(config);
  
    /** @ngInject */
    function config($logProvider, toastr, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);
    
        // Set options third-party lib
        toastr.options.timeOut = 3000;
        toastr.options.positionClass = 'toast-top-right';
        toastr.options.preventDuplicates = true;
        toastr.options.progressBar = true;
        
        // Disable => No 'Access-Control-Allow-Origin' header is present on the requested resource.
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        
        // Need to send cookies in HTTP request
        $httpProvider.defaults.withCredentials = true;
    }
})();
