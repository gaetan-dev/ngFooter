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
		
		// Modal Availabilities
		function showOrganize () {	
			initializeOrganizeModalData (function () {
				ModalService.showModal({
					templateUrl: 'app/components/services/organize/organize.modal.html',
					controller: OrganizeModalController,
					inputs: {
						availabilities: api.availabilities.Availabilities,
						events: api.events.Events
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
				
				/* Views */
				$scope.calendar = true;
				$scope.organize = false;		
				
				/**
				* Action when the user close the modal
				* @method close
				* @param result
				*/
				$scope.close = function (result) {
					myModalService.closeModal(close, result);
				};
				
				/**
				* @method switchViews
				*/	
				function switchViews () {
					$scope.calendar = !$scope.calendar;
					$scope.organize = !$scope.organize;
				} 
				
				/**
				* @method initializePlayersAvailabilities
				* @return $promise
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
						switch ($scope.availabilitiesOfDay[i].Mode) {
							case 'available':
								playersAvailable.push($scope.availabilitiesOfDay[i].User);
								break;
							case 'perhaps':
								playersPerhaps.push($scope.availabilitiesOfDay[i].User);
								break;
							case 'unknown':
								playersUnknown.push($scope.availabilitiesOfDay[i].User);
								break;
							case 'unavailable':
								playersUnavailable.push($scope.availabilitiesOfDay[i].User);
								break;
						}
					}
					
					players = [playersAvailable, playersPerhaps, playersUnknown, playersUnavailable];
					console.log(players);
					deferred.resolve(players);
					return deferred.promise;
				} 			
			}
		}
		
		/**
		* @method initializePlayersAvailabilities
		* @param callback()
		*/
		function initializeOrganizeModalData (callback) {
			availabilitiesService.getAvailabilities().then(function (availabilities) {
				api.availabilities = availabilities;
				eventsService.getUserEvents($rootScope.user.Id).then(function (events) {
					api.events = events;
					callback();
				});
			});
		}
		
		return api;
	}
})();
