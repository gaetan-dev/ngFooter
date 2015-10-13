/* global beforeEach, describe, inject, it, expect */
(function() {
    'use strict';
  
    describe('Service: OrganizeModalService', function () {
        
        /* Variables */
		var rootScope;
		var $httpBackend;
		var service;
		
		/* Methodes Mock*/
		var getAvailabilitiesMock;
		var getEventsMock;	
        
        /* Before Each */	
        beforeEach(module ('footer', function ($provide) { 
			var availabilitiesServiceMock = {
				getAvailabilities: function() {
					var result = getAvailabilitiesMock();
					return result;
				}
			};
			
			var eventsServiceMock = {
				getEvents: function() {
					var result = getEventsMock();
					return result;
				}
			};
			
            $provide.value('availabilitiesService', availabilitiesServiceMock);
			$provide.value('eventsService', eventsServiceMock);
        }));
		
		beforeEach(inject (function ($rootScope, $q, _organizeModalService_, _$httpBackend_, ENV) {
			/* Init Variables */			
			rootScope = $rootScope;
			$httpBackend = _$httpBackend_;
			$httpBackend.when('GET', ENV.api.URL + 'auth/').respond({ id: 1});
			service = _organizeModalService_;
			
			/* Init Methodes Mock*/
			getAvailabilitiesMock = function() {
				var deferred = $q.defer();
				var result = [ { id: 0 }, { id: 1}, { id: 2} ]; 
				deferred.resolve(result);
				return deferred.promise;
			};
			getEventsMock = function() {
				var deferred = $q.defer();
				var result = [ { id: 0 }, { id: 1} ]; 
				deferred.resolve(result);
				return deferred.promise;
			};
		}));

        
        /* Unit Test */
        it('should initialize availabilities and events', function () {
            expect(service.availabilities.length).toBe(0);
			$httpBackend.flush();
			service.initializeOrganizeModalData(function() {});
			rootScope.$digest();
			expect(service.availabilities.length).toBe(3);
        });
    });
})();
