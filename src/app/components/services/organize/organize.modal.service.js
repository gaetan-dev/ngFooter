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
					controller: OrganizeModalController,
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
			
			function OrganizeModalController ($rootScope, $scope, $q, myModalService, toolsService, calendarService, close, availabilities, events) {						
				/* Open */
				myModalService.openModal();
				
				/* Variables */
				$scope.availabilitiesCopy = angular.copy(availabilities);
				$scope.events = events;
				$scope.date = "";
				$scope.hours = "";

				$scope.availabilitiesOfDay = [];
				
				/* Methodes */												
				$scope.switchViews = switchViews;
				$scope.initializePlayersAvailabilities = initializePlayersAvailabilities;
				$scope.close = closeModal;
				
				/* Views */
				$scope.calendar = true;
				$scope.organize = false;		
				
				/**
				 * Action when the user close the modal
				 * @method close
				 * @param result
				 */
				function closeModal (result) {
					myModalService.closeModal(close, result);
				}
				
				/**
				 * @method switchViews
				 */	
				function switchViews () {
					$scope.calendar = !$scope.calendar;
					$scope.organize = !$scope.organize;
				} 
				
				/**
				 * @method initializePlayersAvailabilities
				 * @return $promise {}
				 */
				function initializePlayersAvailabilities () {
					var deferred = $q.defer();
					
					$scope.availabilitiesOfDay = calendarService.fetchAvailabilities(availabilities, $scope.date, $scope.hours);
					
					var players = [];
					var playersAvailable = [];
					var playersPerhaps = []; 
					var playersUnknown = []; 
					var playersUnavailable = [];
					
					for (var i = 0; i < $scope.availabilitiesOfDay.length; i++) {
						switch ($scope.availabilitiesOfDay[i].mode) {
							case 'available':
								playersAvailable.push($scope.availabilitiesOfDay[i].user);
								break;
							case 'perhaps':
								playersPerhaps.push($scope.availabilitiesOfDay[i].user);
								break;
							case 'unknown':
								playersUnknown.push($scope.availabilitiesOfDay[i].user);
								break;
							case 'unavailable':
								playersUnavailable.push($scope.availabilitiesOfDay[i].user);
								break;
						}
					}
					
					players = [playersAvailable, playersPerhaps, playersUnknown, playersUnavailable];
					deferred.resolve(players);
					return deferred.promise;
				} 			
			}
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