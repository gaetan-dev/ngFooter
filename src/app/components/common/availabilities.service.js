(function() {
    'use strict';

    angular
        .module('footer')
		.service('availabilitiesService', availabilitiesService); 
      
    /** @ngInject */  
    function availabilitiesService($rootScope, $q, $http, $timeout, ENV) {
        var api = this;   
         
        /**
         * GET HTTP restfull
         * Get all availabilities 
         * @method getAvailabilities
         * @return availabilities
         */ 
        api.getAvailabilities = function () {
            return $http.get(ENV.api.AVAILABILITY_URL)
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
            return $http.get(ENV.api.AVAILABILITY_URL + '?user_id=' + userId)
                .then(function (response) {
                    return response.data; 
                }); 
        };
        
        /**
         * POST HTTP restfull
         * Create the availability
         * @method createAvailability
         * @param availability
         * @return $http
         */
        api.createAvailability = function (availability) {
            return $http.post(ENV.api.AVAILABILITY_URL, {
                date: availability.date,
                hours: availability.hours,
                mode: availability.mode,
                user: $rootScope.user
            });
        };
        
        /**
         * POST HTTP restfull
         * Create the availabilities
         * @method createAvailabilities
         * @param availabilities
         * @return $http
         */
        api.createAvailabilities = function (availabilities) {
            for (var i = 0; i < availabilities.length; i++) {
                availabilities[i].user = $rootScope.user.id;
            }
            return $http.post(ENV.api.AVAILABILITY_URL, {
                availabilities: availabilities
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
            return $http.put(ENV.api.AVAILABILITY_URL, {
                availabilities: availabilities
            });
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
            return $http.put(ENV.api.AVAILABILITY_URL, {
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
