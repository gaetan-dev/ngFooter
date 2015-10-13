(function() {
    'use strict';

    angular
        .module('footer')
		.factory('organizeModalService', organizeModalService); 
      
    /** @ngInject */  
    function organizeModalService($rootScope, ModalService, availabilitiesService, eventsService) {
		var api = {};
		
		/* Variables */
		api.availabilities = [];
		api.events = [];
		
		/* Methodes */
		api.showOrganize = showOrganize;
		api.initializeOrganizeModalData = initializeOrganizeModalData;
						
						
		function showOrganize () {
			initializeOrganizeModalData (function () {
				ModalService.showModal({
					templateUrl: 'app/components/services/organize/organize.modal.html',
					controller: 'OrganizeModalController',
					controllerAs: 'vm',
					inputs: {
						availabilities: api.availabilities,
						events: api.events
					}
				})
				.then(function(modal) {
					api.modal = modal.element;
					modal.element.show(500);
					modal.close.then(function() {
					});
				});
			});
		}
		
		/**
		 * @method initializeOrganizeModalData
		 * @param callback()
		 */	
		function initializeOrganizeModalData (callback) {
			availabilitiesService.getAvailabilities().then(function (availabilities) {
				api.availabilities = availabilities;
				eventsService.getEvents().then(function (events) {
					api.events = events;
					callback();
				});
			});
		}
		
		return api;
	}
})();