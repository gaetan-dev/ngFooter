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
      controller: AvailabilityCalendarController,
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
          scope.displayedDate = scope.currentDate.format('MMMM') + ' ' +
            scope.currentDate.format('YYYY');
          scope.calendarData = _generateCalendarData(scope.currentDate,
            scope.availabilities, scope.events);
        }

        /**
         * Built the table of case's state for each hours for the html classes
         * @method computeCaseClasses
         * @param date
         * @return classes
         */
        function computeCaseClasses(availabilities, events) {
          var classes = [];

          for (var i = 0; i < numberOfHours; i++) {
            classes[i] = 'fc-unknown';
          }

          calendarFactory.computeCaseClassesNext(classes, availabilities);
          calendarFactory.computeCaseClassesNext(classes, events);

          return classes;
        }

        /* APIs */
        function previousMonth() {
          calendarFactory.previousMonth(scope.currentDate)
            .then(function (currentDate) {
              scope.currentDate = currentDate;
              scope.updateCalendar();
            });
        }

        function nextMonth() {
          calendarFactory.nextMonth(scope.currentDate)
            .then(function (currentDate) {
              scope.currentDate = currentDate;
              scope.updateCalendar();
            });

        }

        function resetMonth() {
          calendarFactory.nextMonth(scope.currentDate)
            .then(function (currentDate) {
              scope.currentDate = currentDate;
              scope.updateCalendar();
            });
        }

        /**
         * Generate calendar's datas
         * @method _generateCalendarData
         * @param date
         * @param availabilities
         * @return days []
         */
        function _generateCalendarData(date, availabilities, events) {
          return calendarFactory.generateCalendarData(date, availabilities,
            events, scope.computeCaseClasses);
        }


        /* Watchers */
        scope.$watchCollection('availabilities', scope.updateCalendar);
      }
    };

    return directive;

    /** @ngInject */
    function AvailabilityCalendarController($rootScope, $scope, calendarService,
      availabilitiesService, toolsService) {
      var vm = this;

      /* Variables */
      vm.availabilities = $scope.availabilities;
      vm.events = $scope.events;
      vm.save = false;

      vm.saveAllPromise = {};

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
        // If it's a date in the past or today, do nothing
        if (date.isBefore() && !date.isSame(moment(), 'day')) {
          return;
        }

        date = date.toISOString().substring(0, 10);

        var event = calendarService.fetchEvent(vm.events, date, hours);
        if (event) {
          return;
        }

        vm.save = true;

        var availabilityStatic =
          calendarService.fetchAvailability(availabilitiesStatic, date, hours);
        if (availabilityStatic) {
          _updateAvailability(availabilityStatic);
        } else {
          _newAvailability(date, hours);
        }

        $scope.updateCalendar();
      }


      /**
       * Action when the user click on the save button
       * @method onSaveClick
       * @param date
       * @param hours
       */
      function onSaveClick() {
        if (availabilitiesCreated.length > 0) {
          _saveAvailabilitiesCreated();
        }
        if (availabilitiesUpdated.length > 0) {
          _saveAvailabilitiesUpdated();
        }

        availabilitiesStatic = angular.copy(vm.availabilities);
        vm.save = false;
      }

      /**
       * Save in database the new availabilities created
       * @method _saveAvailabilitiesCreated
       */
      function _saveAvailabilitiesCreated() {
        var promise = availabilitiesService.createAvailabilities(availabilitiesCreated)
          .then(function () {
            availabilitiesCreated = [];
          });
        vm.saveAllPromise = $q.all([vm.saveAllPromise, promise]);
      }

      /**
       * Save in database the new availabilities updated
       * @method _saveAvailabilitiesUpdated
       */
      function _saveAvailabilitiesUpdated() {
        var modes = ['available', 'perhaps', 'unavailable', 'unknown'];

        /*jshint loopfunc: true */
        for (var i = 0; i < modes.length; i++) {
          var filter = availabilitiesUpdated.filter(function (e) {
            return e.mode === modes[i];
          });

          if (filter.length === 0) {
            continue;
          }

          var promise =
            availabilitiesService.updateAvailabilities(filter, modes[i])
            .then(function (response) {
              if (response.status !== 200) {
                // error
                return;
              }
              toolsService.removeSubArray(availabilitiesUpdated, response.data);
            });
          vm.saveAllPromise = $q.all([vm.saveAllPromise, promise]);
        }
        /*jshint loopfunc: true */
      }

      /**
       * @method _updateAvailability
       * @param availabilityStatic
       */
      function _updateAvailability(availabilityStatic) {
        var availability = calendarService.fetchAvailability(vm.availabilities,
          availabilityStatic.date, availabilityStatic.hours);
        _switchMode(availability);
        var availabilityUpdated =
          calendarService.fetchAvailability(availabilitiesUpdated,
            availabilityStatic.date, availabilityStatic.hours);
        if (availabilityUpdated === undefined) {
          calendarService.addAvailability(availabilitiesUpdated, availability);
        }
      }

      /**
       * @method _newAvailability
       * @param date
       * @param hours
       */
      function _newAvailability(date, hours) {
        var availabilityCreated =
          calendarService.fetchAvailability(availabilitiesCreated, date, hours);
        if (availabilityCreated) {
          _updateNewAvailability(availabilityCreated);
        } else {
          _addNewAvailability(date, hours);
        }
      }

      /**
       * @method _updateNewAvailability
       * @param availabilityCreated
       */
      function _updateNewAvailability(availabilityCreated) {
        var availabilityUpdated = calendarService.fetchAvailability(vm.availabilities,
          availabilityCreated.date, availabilityCreated.hours);
        _switchMode(availabilityUpdated);
        _switchMode(availabilityCreated);
      }

      /**
       * @method addNewAvailability
       * @param date
       * @param hours
       */
      function _addNewAvailability(date, hours) {
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
      function _switchMode(availability) {
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
    }
  }
})();
