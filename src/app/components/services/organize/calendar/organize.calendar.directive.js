/* global angular */
(function() {
    'use strict';

    angular
        .module('footer')
        .directive('acmeOrganizeCalendar', acmeOrganizeCalendar);

    /** @ngInject */
    function acmeOrganizeCalendar(moment, calendarFactory) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/services/organize/calendar/organize.calendar.html',
            controller: OrganizeCalendarController,
            controllerAs: 'vm',
            scope: {
                availabilities: '=',
                events: '='
            },
            link:     
                function postLink(scope) {  
            
                    /* Variables */
                    scope.currentDate = moment();                  
                    scope.WEEK_DAYS = moment.weekdaysMin();
                    scope.WEEK_DAYS.pop();      // Remove Saturday
                    scope.WEEK_DAYS.shift();    // Remove Sunday
                    var numberOfHours = 3;                                   
                    
                    /* Methodes */
                    scope.updateCalendar = updateCalendar; 
                    scope.computeCaseClasses = computeCaseClasses; 
                    scope.previousMonth = previousMonth;   
                    scope.nextMonth = nextMonth;  
                    scope.resetMonth = resetMonth;
                    
                                                        
                    /**
                     * Update the calendar's header and calendar's datas 
                     * @method updateCalendar
                     */                                              
                    function updateCalendar () {
                        scope.vm.select = false;
                        scope.displayedDate = scope.currentDate.format('MMMM') + ' ' + scope.currentDate.format('YYYY');
                        scope.calendarData = generateCalendarData(scope.currentDate, scope.availabilities, scope.events);
                    }
                    
                    /**
                     * Generate calendar's datas
                     * @method generateCalendarData
                     * @param date
                     * @param availabilities
                     * @return days []
                     */
                    function generateCalendarData(date, availabilities, events) {
                        return calendarFactory.generateCalendarData(date, availabilities, events, scope.computeCaseClasses);
                    }  
                    
                    /**
                     * Built the table of the case's state for each hours for the html classes
                     * @method computeCaseClasses
                     * @param date
                     * @return classes []
                     */
                    function computeCaseClasses (availabilities, events) {
                        var classes = [];                     
                        
                        var availables = computeAvailableCase(availabilities);
                        computeCaseAvailabilityClasses(classes, availables);
                        calendarFactory.computeCaseClassesNext(classes, events);
                        
                        return classes;
                    }
                    
                    /**
                     * Count the number of type of availabilities to each hours
                     * @method computeAvailableCase
                     * @param availabilities
                     * @return availables []
                     */
                    function computeAvailableCase(availabilities) {
                        var availables = [];
                        
                        var i;
                        for (i = 0; i < numberOfHours; i++) {
                            availables[i] = 0;
                        }

                        for (i = 0; i < availabilities.length; i++) {
                            switch(availabilities[i].hours) {
                                case '18:00':
                                    if (availabilities[i].mode === 'available') {
                                        availables[0]++;
                                    } 
                                    break;
                                case '18:30':
                                    if (availabilities[i].mode === 'available') {
                                        availables[1]++;
                                    } 
                                    break;
                                case '19:00':
                                    if (availabilities[i].mode === 'available') {
                                        availables[2]++;
                                    } 
                                    break;
                            }
                        }
                                               
                        return availables;
                    }
                    
                    
                    /**
                     * Assigns the class depending on the number of availabilities of each hours
                     * @method computeCaseAvailabilityClasses
                     * @param classes
                     * @param availables
                     */
                    function computeCaseAvailabilityClasses(classes, availables) {
                        for (var i = 0; i < availables.length; i++) {
                            if (availables[i] >= 0 && availables[i] < 2) {
                                classes[i] = 'fc-0_2';
                            }
                            if (availables[i] >= 3 && availables[i] < 7) {
                                classes[i] = 'fc-3_6';
                            }
                            if (availables[i] >= 6 && availables[i] < 10) {
                                classes[i] = 'fc-7_9';
                            }
                            if (availables[i] >= 10) {
                                classes[i] = 'fc-10';
                            }
                        }                                        
                    }                         
                    
                    /* APIs */
                    function previousMonth () {
                        calendarFactory.previousMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });
                    }
                  
                    function nextMonth () {
                        calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });                       
                    }
                    
                    function resetMonth () {
                       calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
                            scope.currentDate = currentDate;
                            scope.updateCalendar();
                        });
                    }
                    
                    /* Watchers */
                    scope.$watchCollection('availabilities', scope.updateCalendar); 
                    scope.$watchCollection('events', scope.updateCalendar);   
                }
        };
                
        return directive;
        
        /** @ngInject */
        function OrganizeCalendarController($rootScope, $scope, calendarService) {
            var vm = this;     
            
            /* Variables */  
            vm.availabilities = $scope.availabilities;
            vm.events = $scope.events;
            
            /* Methodes */
            vm.onCaseClick = onCaseClick;
            

            /**
            * Action when the user click on the case of one day
            * @method onCaseClick
            * @param date
            * @param hours
            */
            function onCaseClick (date, hours) {  
                // If it's a date in the past, do nothing
                if (date.isBefore() && !date.isSame(moment(), 'day')) { return; }

                date = date.toISOString().substring(0, 10);
                var event = calendarService.fetchEvent(vm.events, date, hours);

                if (event) { return; }
                
                $scope.$parent.vm.date = date;
                $scope.$parent.vm.hours = hours;
                
                switchViews();            
            }
                    
            function switchViews() {
                $scope.$parent.vm.switchViews();
            }  
        }       
    }
})();