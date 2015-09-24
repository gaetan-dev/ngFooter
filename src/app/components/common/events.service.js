(function() {
    'use strict';

    angular
        .module('footer')
		.service('eventsService', eventsService); 
      
    /** @ngInject */  
    function eventsService($rootScope, $q, $http, $timeout, ENV) {
        var api = this;   
               
        /**
         * GET HTTP restfull
         * Get all events 
         * @method getEvents
         * @return events
         */ 
        api.getEvents = function () {
            return $http.get(ENV.api.EVENT_URL)
                .then(function (response) {
                    return response.data; 
                }); 
        };
        
        /**
         * GET HTTP restfull
         * Get all events of the user id 
         * @method getUserEvents
         * @param userId
         * @return events
         */ 
        api.getUserEvents = function (user_id) {
            return $http.get(ENV.api.EVENT_URL + '?user_id=' + user_id)
                .then(function (response) {
                    return response.data; 
                }); 
        };
        
        /**
         * CREATE HTTP restfull
         * Create the event with the paramters
         * @method createEvent
         * @param id
         * @return 
         */
        api.createEvent = function (date, hours, mode, prvt, users) {
            return $http.post(ENV.api.EVENT_URL, {
                date: date,
                hours: hours,
                mode: mode,
                'private': prvt,
                master: $rootScope.user.id,
                users: users
            });
        };
        
        /**
         * PUT HTTP restfull
         * Update the events
         * @method updateEvents
         * @param events
         * @return $http
         */
        api.updateEvents = function (events) {
            return $http.put(ENV.api.EVENT_URL, events);
        };
        
        /**
         * PUT HTTP restfull
         * Update the event
         * @method updateEvent
         * @param id
         * @param mode
         * @return $http
         */
        api.updateEvent = function (id, mode) {
            return $http.put(ENV.api.EVENT_URL, {
                Id: id,
                Mode: mode,
            });
        }; 
        
        /**
         * Remove the event
         * @method removeEvent
         * @param id
         * @return updateremoveEvent(id, mode)
         */ 
        api.removeEvent = function (id) {
            // DELETE actions are not authorized @AXA, so we use the same actions
            // This acts like a toggle : creates it if it doesn't exists, and then
            // toggle a boolean
            return api.updateAvailability(id, 'unknown');
        };   
              
        return api;
    }
})();
