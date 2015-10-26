/* global angular */
(function () {
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
      link: function postLink(scope) {

        /* Variables */
        scope.currentDate = moment();
        scope.WEEK_DAYS = moment.weekdaysMin();
        scope.WEEK_DAYS.pop(); // Remove Saturday
        scope.WEEK_DAYS.shift(); // Remove Sunday

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
        function updateCalendar() {
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
         * Built the table of case's state for each hours for the html classes
         * @method computeCaseClasses
         * @param date
         * @return classes
         */
        function computeCaseClasses(availabilities, events) {
          var classes = [];

          var i;
          for (i = 0; i < numberOfHours; i++) {
            classes[i] = 'fc-unknown';
          }

          calendarFactory.computeCaseClassesNext(classes, availabilities);
          calendarFactory.computeCaseClassesNext(classes, events);

          return classes;
        }

        /* APIs */
        function previousMonth() {
          calendarFactory.previousMonth(scope.currentDate).then(function (currentDate) {
            scope.currentDate = currentDate;
            scope.updateCalendar();
          });
        }

        function nextMonth() {
          calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
            scope.currentDate = currentDate;
            scope.updateCalendar();
          });

        }

        function resetMonth() {
          calendarFactory.nextMonth(scope.currentDate).then(function (currentDate) {
            scope.currentDate = currentDate;
            scope.updateCalendar();
          });
        }


        /* Watchers */
        scope.$watchCollection('availabilities', scope.updateCalendar);
      }
    };

    return directive;

    /** @ngInject */
    function CalendarController($rootScope, $scope, calendarService, availabilitiesService) {
      var vm = this;

      /* Variables */
      vm.availabilities = $scope.availabilities;
      vm.events = $scope.events;
      vm.save = false;

      var availabilitiesStatic = angular.copy(vm.availabilities);
      var availabilitiesCreated = [];
      var availabilitiesUpdated = [];

      /* Methodes */
      vm.onCaseClick = onCaseClick;
      vm.onSaveClick = onSaveClick;


      /**
       * Action when the user click on the case of one day
       * @method onCaseClick
       * @param date
       * @param hours
       */
      function onCaseClick(date, hours) {
        // If it's a date in the past, do nothing
        if (date.isBefore() && !date.isSame(moment(), 'day')) {
          return;
        }

        date = date.toISOString().substring(0, 10);
        var event = calendarService.fetchEvent(vm.events, date, hours);

        if (event) {
          return;
        }

        vm.save = true;

        var availabilityStatic = calendarService.fetchAvailability(availabilitiesStatic, date, hours);
        if (availabilityStatic) {
          updateAvailability(availabilityStatic);
        } else {
          newAvailability(date, hours);
        }

        $scope.updateCalendar();
      }

      /**
       * @method updateAvailability
       * @param availabilityStatic
       */
      function updateAvailability(availabilityStatic) {
        var availability = calendarService.fetchAvailability(vm.availabilities, availabilityStatic.date, availabilityStatic.hours);
        switchMode(availability);
        var availability_updated = calendarService.fetchAvailability(availabilitiesUpdated, availabilityStatic.date, availabilityStatic.hours);
        if (availability_updated === undefined) {
          calendarService.addAvailability(availabilitiesUpdated, availability);
        }
      }

      /**
       * @method availabilityCreated
       * @param date
       * @param hours
       */
      function newAvailability(date, hours) {
        var availabilityCreated = calendarService.fetchAvailability(availabilitiesCreated, date, hours);
        if (availabilityCreated) {
          updateNewAvailability(availabilityCreated);
        } else {
          addNewAvailability(date, hours);
        }
      }

      /**
       * @method updateNewAvailability
       * @param availabilityCreated
       */
      function updateNewAvailability(availabilityCreated) {
        var availability = calendarService.fetchAvailability(vm.availabilities, availabilityCreated.date, availabilityCreated.hours);
        switchMode(availability);
        switchMode(availabilityCreated);
      }

      /**
       * @method addNewAvailability
       * @param date
       * @param hours
       */
      function addNewAvailability(date, hours) {
        var availability = {
          date: date,
          hours: hours,
          mode: 'available'
        };

        var availabilityCreated = angular.copy(availability);
        calendarService.addAvailability(vm.availabilities, availability);
        calendarService.addAvailability(availabilitiesCreated, availabilityCreated);
      }

      /**
       * Change the availability's mode
       * @method computeAvailability
       * @param availability
       */
      function switchMode(availability) {
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

      /**
       * Action when the user click on the save button
       * @method onSaveClick
       * @param date
       * @param hours
       */
      function onSaveClick() {
        if (availabilitiesCreated.length > 0) {
          availabilitiesService.createAvailabilities(availabilitiesCreated).then(function () {
            availabilitiesCreated = [];
          });
        }
        if (availabilitiesUpdated.length > 0) {
          availabilitiesService.updateAvailabilities(availabilitiesUpdated).then(function () {
            availabilitiesUpdated = [];
          });
        }

        availabilitiesStatic = angular.copy(vm.availabilities);
        vm.save = false;
      }
    }
  }
})();
