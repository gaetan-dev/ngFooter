(function() {
    'use strict';

    angular
        .module('footer')
		.factory('calendarFactory', calendarFactory); 
      
    /** @ngInject */  
    function calendarFactory ($q, $http, $timeout, ENV, moment) {
        var api = this;   
        
        /* Variables */
        var reverse = false; 
        
        /* Methodes */
        api.generateCalendarData = generateCalendarData;
        api.computeCaseClassesNext = computeCaseClassesNext;
        api.previousMonth = previousMonth;
        api.nextMonth = nextMonth;
        api.resetMonth = resetMonth;
         
        /** 
         * Generate calendar's datas
         * @method generateCalendarData
         * @param date
         * @param availabilities
         * @param callback
         * @return days
         */
        function generateCalendarData (date, availabilities, events, callback) {
            var day = moment(date),
                firstDayOfMonth = day.date(1),
                numberOfRows = Math.ceil((firstDayOfMonth.weekday() + firstDayOfMonth.daysInMonth()) / 7),
                numberOfDays = numberOfRows * 7,
                currentDate = firstDayOfMonth.weekday(0),
                days = [],
                dayData,
                counter = 0;                          
                            
            /*jshint loopfunc: true */  
            // if moment local is 'fr' then numberOfDays-1 else numberOfDays
            while (counter++ <= numberOfDays-1) {
                dayData = {
                    date: currentDate,
                    availabilities: (availabilities || [])
                        .filter(function (availability) {
                            return moment(availability.date).isSame(currentDate, 'day');
                        })
                        .map(function (availability) {
                            availability.label = availability.mode;
                            return availability;
                        }),
                    events: (events || [])
                        .filter(function (event) {
                            return moment(event.date).isSame(currentDate, 'day');
                        })
                        .map(function (event) {
                            event.label = event.mode;
                            return event;
                        })
                };       
            
                dayData.classes = computeDayClasses(currentDate);
                dayData.CaseClasses = callback(dayData.availabilities, dayData.events);
    
                if (dayData.date.day() >= 1 && dayData.date.day() <= 5) {
                    days.push(dayData);
                }
                currentDate = currentDate.clone().add(1, 'day');
            }
            /*jshint loopfunc: false */
            return days;
        }
            
        /**
         * Built the table of state for each day for the html classes
         * @method computeDayClasses
         * @param date
         * @return classes
         */
        function computeDayClasses (date) {
            var classes = [],
                today = moment();
        
            if (date.isBefore(today, 'day')) {
                classes.push('fc-past');
            } else if (date.isSame(today, 'day')) {
                classes.push('fc-today');
            } else {
                classes.push('fc-future');
            }
        
            if (date.isBefore(today, 'month')) {
                classes.push('fc-previous-month');
            } else if (date.isSame(today, 'month')) {
                classes.push('fc-current-month');
            } else {
                classes.push('fc-next-month');
            }
        
            return classes;
        } 
        
        /**
         * @method computeCaseClassesNext
         * @param classes
         * @param array
         */
        function computeCaseClassesNext (classes, array) {
            for (var i = 0; i < array.length; i++) {
                switch(array[i].hours) {
                    case "18:00":
                        classes[0] = ('fc-' + array[i].mode.toLowerCase());
                        break;
                    case "18:30":
                        classes[1] = ('fc-' + array[i].mode.toLowerCase());
                        break;
                    case "19:00":
                        classes[2] = ('fc-' + array[i].mode.toLowerCase());
                }
            }                       
        }         
        
        /**
         * Change the month of currentDate by the previous month
         * @method previousMonth
         * @param currentDate
         * @return date
         */
        function previousMonth (currentDate) {
            reverse = true;
            return animationLeave()
                .then(function () {
                    return moment(currentDate).subtract(1, 'month');
            });
        }
        
        /**
         * Change the month of currentDate by the next month
         * @method nextMonth
         * @param currentDate
         * @return date
         */
        function nextMonth (currentDate) {
            reverse = false;
            return animationLeave()
                .then(function () {
                    return moment(currentDate).add(1, 'month');
                });
        }
        
        /**
         * Reset by the current month
         * @method nextMonth
         * @param currentDate
         * @return date
         */
        function resetMonth () {
            return moment();
        }
        
        /* Animations */
        var timer;
        var entering = false;
        var leaving = false;
        var animating = false;
        function animationLeave () {
            var deferred = $q.defer();
            $timeout.cancel(timer);
            entering = false;
            animating = true;
            
            $timeout(function () {
                leaving = true;
            }, 1);
            
            timer = $timeout(function () {
                leaving = false;
            }, 250);
            
            timer.then(function () {
                deferred.resolve();
                animationEnter();
            });
            
            return deferred.promise;
        }
         
        function animationEnter () {
            $timeout.cancel(timer);
            entering = true;
            
            $timeout(function () {
                entering = false;
            }, 1)
            .then(function () {
                timer = $timeout(function () {
                    entering = false;
                    animating = false;
                    reverse = false;
                }, 700);
            });
        }    
        
        return api;
    }
})();
