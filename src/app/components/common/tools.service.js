(function() {
    'use strict';

    angular
        .module('footer')
		.service('toolsService', toolsService); 
      
    /** @ngInject */  
    function toolsService() {
        var api = this;         
        
        /**
        * Find the index in the array through callback
        * @method findIndexCallback
        * @param array
        * @param callback
        * @return indice
        */
        api.findIndexCallback = function (array, callback) {
            for (var i = 0; i < array.length; i++) {
                if (callback(array[i])) {
                    return i;
                }
            }
            return -1;
        }; 
        
        /**
        * Find the index of user in the array
        * @method findUserIndex
        * @param array
        * @param user
        * @return indice
        */
        api.findUserIndex = function (array, user) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].Id === user.Id) {
                    return i;
                }
            }
            return -1;
        }; 
        
        /**
        * Capitalize the first character of a string
        * @method findUserIndex
        * @param str
        * @return Str
        */
        api.capitalizeFirstLetter = function (str) {
            if (str !== null) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        };
  
        return api;
    }
})();
