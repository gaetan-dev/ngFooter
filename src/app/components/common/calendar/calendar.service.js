(function() {
    'use strict';

    angular
        .module('footer')
		.service('calendarService', calendarService); 
      
    /** @ngInject */  
    function calendarService () {
        var api = this; 
        
        /* Methodes */
        api.addAvailability = addAvailability; 
        api.fetchAvailability = fetchAvailability;
        api.fetchAvailabilities = fetchAvailabilities;
        api.buildUsersOfAvailabilities = buildUsersOfAvailabilities;
        api.fetchEvent = fetchEvent;
  
        /**
         * Add the availability in the availabilities array 
         * @method addAvailability
         * @param availabilities
         * @param availability
         */
        function addAvailability (availabilities, availability) {
            availabilities.push(availability);
        }
        
        /**
         * Fetch the availability which match with the parameters
         * @method fetchAvailability
         * @param availabilities
         * @param date
         * @param hours
         * @return availability
         */ 
    	function fetchAvailability (availabilities, date, hours) {
            if (availabilities) {
                for (var i = 0; i < availabilities.length; i++) {
                    if (availabilities[i].date === date && availabilities[i].hours === hours) {
                        return availabilities[i];
                    }
                }
            }
        }
        
        /**
         * Fetch the availabilities which match with the parameters
         * @method fetchAvailabilities
         * @param availabilities
         * @param date
         * @param hours
         * @return availabilities
         */ 
    	function fetchAvailabilities (availabilities, date, hours) {
            var list = [];
            for (var i = 0; i < availabilities.length; i++) {
                if (availabilities[i].date === date && availabilities[i].hours === hours) {
                    list.push(availabilities[i]);
                }
            }
            
            return list;
        }
        
        /**
         * Build the users table of each availabilities
         * @method fetchUsersOfAvailabilities
         * @param availabilities
         * @return users
         */ 
    	function buildUsersOfAvailabilities (availabilities) {
            var users = [];
            for (var i = 0; i < availabilities.length; i++) {
                users.push(availabilities[i].user);
            }
            
            return users;
        }
        
        /**
         * Fetch the event which match with the parameters
         * @method fetchEvent
         * @param events
         * @param date
         * @param hours
         * @return availability
         */ 
    	function fetchEvent (events, date, hours) {
            if (events) {
                for (var i = 0; i < events.length; i++) {
                    if (events[i].date === date && events[i].hours === hours) {
                        return events[i];
                    }
                }
            }
        }
 
        return api;
    }
})();
