(function() {
    'use strict';

    angular
        .module('footer')
		.factory('availabilitiesModalService', availabilitiesModalService); 
      
    /** @ngInject */  
    function availabilitiesModalService($rootScope, ModalService, availabilitiesService, eventsService) {
		var api = {};
		
		/* Methodes */
		api.showAvailabilities = showAvailabilities;

		function showAvailabilities () {
			availabilitiesService.getUserAvailabilities($rootScope.user.id).then(function (availabilities) {
				eventsService.getUserEvents($rootScope.user.id).then(function (events) {
					ModalService.showModal({
						templateUrl: 'app/components/services/availabilities/availabilities.modal.html',
						controller: AvailabilitiesModalController,
						inputs: {
							availabilities: availabilities,
							events: events
						}
					})
					.then(function(modal) {
						modal.element.show(500);
						modal.close.then(function() {
						});
					});
				});
			});			
	
			function AvailabilitiesModalController ($scope, $state, myModalService, close, availabilities, events) {
				/* Open */
				myModalService.openModal();
	
				/* Variables */
				$scope.availabilitiesCopy = angular.copy(availabilities);
				$scope.events = events;
				
				/* Methodes */
				$scope.close = closeModal;
				
				
				/**
				 * Close the modal
				 * @method closeModal
				 * @param result
				 */
				function closeModal (result) {
					myModalService.closeModal(close, result);
				}
			}
		}
		
		return api;
	}
})();
