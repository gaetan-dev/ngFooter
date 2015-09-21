/* global angular */
(function() {
    'use strict';

    angular
        .module('footer')
        .directive('acmeAvailabilitiesCalendar', acmeAvailabilitiesCalendar);

    /** @ngInject */
    function acmeAvailabilitiesCalendar($q, $timeout, moment, calendarFactory) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/services/availabilities/calendar/availabilities.calendar.html',
            controller: CalendarController,
            controllerAs: 'vm',
            scope: {
                availabilities: '=',
                events: '=' 
            },
            link:     
                function postLink(scope) {  
                    
                    scope.currentDate = moment();                  
                    scope.WEEK_DAYS = moment.weekdaysMin();
                    // Remove Saturday and Sunday
                    scope.WEEK_DAYS.pop();
                    scope.WEEK_DAYS.shift();                  
                       
                    /**
                     * Update the calendar's header and calendar's datas 
                     * @method updateCalendar
                     */                                              
                    scope.updateCalendar = function() {                 
                        scope.displayedDate = scope.currentDate.format('MMMM') + ' ' + scope.currentDate.format('YYYY');
                        scope.calendarData = generateCalendarData(scope.currentDate, scope.availabilities, scope.events);
                    };
                    
                    /**
                     * Generate calendar's datas
                     * @method generateCalendarData
                     * @param date
                     * @param availabilities
                     * @return days
                     */
                    function generateCalendarData(date, availabilities, events) {
                        return calendarFactory.generateCalendarData(date, availabilities, events, scope.computeCaseClasses);
                    } 
                    
                    /**
                    * Built the table of case's state for each hours for the html classes
                    * @method computeCaseClasses
                    * @param date
                    * @return classes
                    */
                    var numberOfHours = 3;                                  
                    scope.computeCaseClasses = function (availabilities, events) {
                        var classes = []; 
                        
                        var i;
                        for (i = 0; i < numberOfHours; i++) {
                            classes[i] = 'fc-unknown';
                        }
                        
                        calendarFactory.computeCaseClassesNext(classes, availabilities);
                        calendarFactory.computeCaseClassesNext(classes, events);
                        
                        return classes;
                    };                                        
                    
                    // APIs
                    scope.previousMonth = function () {
                        calendarFactory.previousMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });
                    };
                    
                    scope.nextMonth = function () {
                        calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });

                    };
                    
                    scope.resetMonth = function () {
                       calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });
                    };
            
                    // Watchers
                    scope.$watchCollection('availabilities', scope.updateCalendar);
                }
            };
                
            return directive;
            
            /** @ngInject */
            function CalendarController($scope, calendarService, availabilitiesService) {
                var vm = this;
               
               /* Variables */
                vm.availabilities = $scope.availabilities;
                vm.events = $scope.events;
                vm.save = false;       

                /**
                 * Action when the user click on the case of one day
                 * @method onCaseClick
                 * @param date
                 * @param hours
                 */
                vm.onCaseClick = function (date, hours) {
                    // If it's a date in the past, do nothing
                    if (date.isBefore() && !date.isSame(moment(), 'day')) { return; }
                    
                    date = date.toISOString().substring(0, 10);
                    var availability = calendarService.fetchAvailability(vm.availabilities, date, hours);
                    var event = calendarService.fetchEvent(vm.events, date, hours);
                    
                    if (event) { return; }
                    
                    if (!availability) {
                        calendarService.addAvailability(vm.availabilities, date, hours, 'available');           
                    } else {
                        switch (availability.Mode) {
                            case 'available':
                                availability.Mode = 'perhaps';          
                                break;
                            case 'perhaps':
                                availability.Mode = 'unavailable';
                                break;
                            case 'unavailable':
                                availability.Mode = 'unknown';
                                break;
                            case 'unknown':
                                availability.Mode = 'available';
                                break;
                        }
                    }

                    vm.save = true;  
                    $scope.updateCalendar();                  
                };
                
                vm.onSaveClick = function () {
                    availabilitiesService.updateAvailabilities(vm.availabilities).then(function () {
                        vm.save = false;
                    });
                };              
            }
        }
})();