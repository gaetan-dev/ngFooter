(function() {
    'use strict';

    angular
        .module('footer')
		.service('myModalService', myModalService); 
      
    /** @ngInject */  
    function myModalService($timeout) {
        var api = this;  
        
        /* Methodes */
        api.openModal = openModal;
        api.closeModal = closeModal;
        
        /**
		 * Open the modal
		 * @method openModal
		 */
        function openModal () {
            $timeout(function () {
                angular.element(document.getElementById('body')).addClass('modal-open');
            }, 400);
        }
        
        /**
		 * Close the modal
		 * @method closeModal
		 */
        function closeModal (close, result) {
            close(result, 0); // close, but give 0ms for bootstrap to animate
            angular.element(document.getElementById('body')).removeClass('modal-open');
        }
        
        return api;
    }
})();
