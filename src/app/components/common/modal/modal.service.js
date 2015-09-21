(function() {
    'use strict';

    angular
        .module('footer')
		.service('myModalService', myModalService); 
      
    /** @ngInject */  
    function myModalService($timeout) {
        var api = this;  
        
        api.openModal = function () {
            $timeout(function() {
                angular.element(document.getElementById('body')).addClass('modal-open');
            }, 400);
        };
        
        api.closeModal = function (close, result) {
            close(result, 0); // close, but give 500ms for bootstrap to animate
            angular.element(document.getElementById('body')).removeClass('modal-open');
        };
        
        return api;
    }
})();
