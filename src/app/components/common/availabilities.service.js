(function() {
    'use strict';

    angular
        .module('footer')
		.service('availabilitiesService', availabilitiesService); 
      
    /** @ngInject */  
    function availabilitiesService($q, $http, $timeout, ENV) {
        var api = this;   
         
        /**
         * GET HTTP restfull
         * Get all availabilities 
         * @method getAvailabilities
         * @return availabilities
         */ 
        api.getAvailabilities = function () {
            return $http.get(ENV.api.AVAILABILITIES_URL)
                .then(function (response) {
                    return response.data; 
                }); 
        };
        
        /**
         * GET HTTP restfull
         * Get all availabilities of the user id 
         * @method getUserAvailabilities
         * @param userId
         * @return availabilities
         */ 
        api.getUserAvailabilities = function (userId) {
            return $http.get(ENV.api.AVAILABILITIES_URL + userId)
                .then(function (response) {
                    return response.data; 
                }); 
        };
        
        /**
         * POST HTTP restfull
         * Create the availability with the paramters
         * @method removeAvailability
         * @param id
         * @return 
         */
        api.createAvailability = function (date, hours, mode) {
            return $http.post(ENV.api.AVAILABILITIES_URL, {
                Date: date,
                Hours: hours,
                Mode: mode,
            });
        };
        
        /**
         * PUT HTTP restfull
         * Update the availabilities
         * @method updateAvailabilities
         * @param availabilities
         * @return $http
         */
        api.updateAvailabilities = function (availabilities) {
            return $http.put(ENV.api.AVAILABILITIES_URL, availabilities);
        };
        
        /**
         * PUT HTTP restfull
         * Update the availability
         * @method updateAvailability
         * @param id
         * @param mode
         * @return $http
         */
        api.updateAvailability = function (id, mode) {
            return $http.put(ENV.api.AVAILABILITIES_URL, {
                Id: id,
                Mode: mode,
            });
        };
        
        /**
         * Remove the availability
         * @method removeAvailability
         * @param id
         * @return updateAvailability(id, mode)
         */ 
        api.removeAvailability = function (id) {
            // DELETE actions are not authorized @AXA, so we use the same actions
            // This acts like a toggle : creates it if it doesn't exists, and then
            // toggle a boolean
            return api.updateAvailability(id, 'unknown');
        };
    
        return api;
    }
})();
