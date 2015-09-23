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
            function CalendarController($rootScope, $scope, calendarService, availabilitiesService, toolsService) {
                var vm = this;
               
               /* Variables */
                vm.availabilities = $scope.availabilities;
                vm.availabilities_static = angular.copy(vm.availabilities);
                vm.availabilities_created = [];
                vm.availabilities_updated = [];

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
                    var event = calendarService.fetchEvent(vm.events, date, hours);
                    
                    if (event) { return; }
                    
                    vm.save = true;  
                    
                    var availability_static = calendarService.fetchAvailability(vm.availabilities_static, date, hours);
                    availability_static ? updateAvailability(availability_static) : newAvailability(date, hours);

                    $scope.updateCalendar();                  
                };
                
                function updateAvailability(availability_static) {
                    var availability = calendarService.fetchAvailability(vm.availabilities, availability_static.date, availability_static.hours);
                    computeAvailability(availability);
                    var availability_updated = calendarService.fetchAvailability(vm.availabilities_uptated, availability_static.date, availability_static.hours);
                    availability_updated ? computeAvailability(availability_updated) : calendarService.addAvailability(vm.availabilities_updated, availability);
                }
                
                function newAvailability(date, hours) {
                    var availability_created = calendarService.fetchAvailability(vm.availabilities_created, date, hours);
                    availability_created ? updateNewAvailability(availability_created) : addNewAvailability(date, hours);
                } 
                
                function updateNewAvailability(availability_created) {
                    var availability = calendarService.fetchAvailability(vm.availabilities, availability_created.date, availability_created.hours);       
                    computeAvailability(availability);
                    computeAvailability(availability_created);
                }
                
                function addNewAvailability(date, hours) {
                    var availability = {
                        date: date,
                        hours: hours,
                        mode: 'available'
                    };
                    
                    var availability_created = angular.copy(availability);
                    calendarService.addAvailability(vm.availabilities, availability);
                    calendarService.addAvailability(vm.availabilities_created, availability_created);
                } 
                
                function computeAvailability (availability) {
                     switch (availability.mode) {
                        case 'available':
                            availability.mode = 'perhaps';          
                            break;
                        case 'perhaps':
                            availability.mode = 'unavailable';
                            break;
                        case 'unavailable':
                            availability.mode = 'unknown';
                            break;
                        case 'unknown':
                            availability.mode = 'available';
                            break;
                    }
                }   
                
                vm.onSaveClick = function () {
                    if (vm.availabilities_created.length > 0) {
                        availabilitiesService.createAvailabilities(vm.availabilities_created).then(function () {
                            vm.availabilities_created = [];
                        });
                    }
                    if (vm.availabilities_updated.length > 0) {
                        availabilitiesService.updateAvailabilities(vm.availabilities_updated).then(function () {  
                            vm.availabilities_updated = [];
                        });
                    }
                    
                    vm.availabilities_static = angular.copy(vm.availabilities);
                    vm.save = false;
                };              
            }
        }
})();