(function() {
    'use strict';

    angular
        .module('footer')
		.factory('availabilitiesModalService', availabilitiesModalService); 
      
    /** @ngInject */  
    function availabilitiesModalService(ModalService, availabilitiesService, eventsService) {
		var api = {};
		
		// Modal Availabilities
		api.showAvailabilities = function() {
			availabilitiesService.getUserAvailabilities(1).then(function (availabilities) {
				eventsService.getUserEvents(1).then(function (events) {
					ModalService.showModal({
						templateUrl: 'app/components/services/availabilities/availabilities.modal.html',
						controller: AvailabilitiesModalController,
						inputs: {
							availabilities: availabilities.Availabilities,
							events: events.Events
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
				
				$scope.close = function (result) {
					myModalService.closeModal(close, result);
				};
			}
		};
		
		return api;
	}
})();
