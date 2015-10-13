(function() {
    'use strict';

    angular
        .module('footer')
		.factory('matchesModalService', matchesModalService); 
      
    /** @ngInject */  
    function matchesModalService($rootScope, ModalService, eventsService) {
		var api = {};
		
		/* Methodes */
		api.showMatches = showMatches;

		function showMatches () {
			// eventsService.getUserEvents($rootScope.user.id).then(function (events) {
			eventsService.getEvents().then(function (events) {
				ModalService.showModal({
					templateUrl: 'app/components/services/matches/matches.modal.html',
					controller: MatchesModalController,
					inputs: {
						events: events
					}
				})
				.then(function(modal) {
					modal.element.show(500);
					modal.close.then(function() {
					});
				});
			});			
	
			function MatchesModalController ($scope, myModalService, close, events) {
				/* Open */
				myModalService.openModal();
	
				/* Variables */
				$scope.events = events;
				events.sort(compare);
				
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
				
				function compare (event1, event2) {
					if (event1.date === event2.date) {
						if (event1.hours < event2.hours) { return 1; }
						if (event1.hours > event2.hours) { return -1; }
					}
					if (event1.date < event2.date) { return 1; }
					
					return -1;
				}
			}
		}
		
		return api;
	}
})();
