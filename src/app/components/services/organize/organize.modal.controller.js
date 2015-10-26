(function () {
  'use strict';

  angular
    .module('footer')
    .controller('OrganizeModalController', OrganizeModalController);

  /** @ngInject */
  function OrganizeModalController($rootScope, $q, myModalService, toolsService, calendarService, close, availabilities, events) {
    var vm = this;

    /* Open */
    myModalService.openModal();

    /* Variables */
    vm.availabilitiesCopy = angular.copy(availabilities);
    vm.events = events;
    vm.date = "";
    vm.hours = "";

    vm.availabilitiesOfDay = [];

    /* Methodes */
    vm.switchViews = switchViews;
    vm.initializePlayersAvailabilities = initializePlayersAvailabilities;
    vm.close = closeModal;

    /* Views */
    vm.calendar = true;
    vm.organize = false;

    /**
     * Action when the user close the modal
     * @method close
     * @param result
     */
    function closeModal(result) {
      myModalService.closeModal(close, result);
    }

    /**
     * @method switchViews
     */
    function switchViews() {
      vm.calendar = !vm.calendar;
      vm.organize = !vm.organize;
    }

    /**
     * @method initializePlayersAvailabilities
     * @return $promise {}
     */
    function initializePlayersAvailabilities() {
      var deferred = $q.defer();

      vm.availabilitiesOfDay = calendarService.fetchAvailabilities(availabilities, vm.date, vm.hours);

      var players = [];
      var playersAvailable = [];
      var playersPerhaps = [];
      var playersUnknown = [];
      var playersUnavailable = [];

      for (var i = 0; i < vm.availabilitiesOfDay.length; i++) {
        switch (vm.availabilitiesOfDay[i].mode) {
          case 'available':
            playersAvailable.push(vm.availabilitiesOfDay[i].user);
            break;
          case 'perhaps':
            playersPerhaps.push(vm.availabilitiesOfDay[i].user);
            break;
          case 'unknown':
            playersUnknown.push(vm.availabilitiesOfDay[i].user);
            break;
          case 'unavailable':
            playersUnavailable.push(vm.availabilitiesOfDay[i].user);
            break;
        }
      }

      players = [playersAvailable, playersPerhaps, playersUnknown, playersUnavailable];
      deferred.resolve(players);
      return deferred.promise;
    }
  }
})();
