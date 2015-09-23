(function() {
    'use strict';

    angular
        .module('footer')
		.factory('availabilitiesModalService', availabilitiesModalService); 
      
    /** @ngInject */  
    function availabilitiesModalService($rootScope, ModalService, availabilitiesService, eventsService) {
		var api = {};
		
		// Modal Availabilities
		api.showAvailabilities = function() {
			availabilitiesService.getUserAvailabilities($rootScope.user.id).then(function (availabilities) {
				// eventsService.getUserEvents($rootScope.user).then(function (events) {
					ModalService.showModal({
						templateUrl: 'app/components/services/availabilities/availabilities.modal.html',
						controller: AvailabilitiesModalController,
						inputs: {
							availabilities: availabilities,
							events: events.Events
						}
					})
					.then(function(modal) {
						modal.element.show(500);
						modal.close.then(function() {
						});
					});
				// });
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
