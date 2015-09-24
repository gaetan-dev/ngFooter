/* global angular */
(function() {
    'use strict';

    angular
        .module('footer')
        .directive('acmeCalendar', acmeCalendar);

    /** @ngInject */
    function acmeCalendar () {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/common/calendar/calendar.html',
		};
		
		return directive;
	}
})();