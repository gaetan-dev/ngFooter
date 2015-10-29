(function () {
  'use strict';

  angular
    .module('footer')
    .service('eventsService', eventsService);

  /** @ngInject */
  function eventsService($rootScope, $q, $http, $timeout, ENV) {
    var api = this;

    /* Methodes */
    api.getEvents = getEvents;
    api.getUserEvents = getUserEvents;
    api.createEvent = createEvent;
    api.updateEvent = updateEvent;
    api.removeEvent = removeEvent;

    /**
     * GET HTTP restfull
     * Get all events
     * @method getEvents
     * @return events []
     */
    function getEvents() {
      return $http.get(ENV.api.EVENT_URL)
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * GET HTTP restfull
     * Get all events of the user id
     * @method getUserEvents
     * @param userId
     * @return events []
     */
    function getUserEvents(user_id) {
      return $http.get(ENV.api.EVENT_URL + '?user_id=' + user_id)
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * CREATE HTTP restfull
     * Create the event with the paramters
     * @method createEvent
     * @param id
     * @return event {}
     */
    function createEvent(date, hours, mode, place, prvt, users) {
      return $http.post(ENV.api.EVENT_URL, {
          date: date,
          hours: hours,
          mode: mode,
          place: place,
          'private': prvt,
          master: $rootScope.user.id,
          users: users
        })
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * PUT HTTP restfull
     * Update the event
     * @method updateEvent
     * @param id
     * @param mode
     * @return event []
     */
    function updateEvent(id, mode) {
      return $http.put(ENV.api.EVENT_URL, {
          Id: id,
          Mode: mode,
        })
        .then(function (response) {
          return response.data;
        });
    }

    /**
     * Remove the event
     * @method removeEvent
     * @param id
     * @return updateremoveEvent(id, mode)
     */
    function removeEvent(id) {
      // DELETE actions are not authorized @AXA, so we use the same actions
      // This acts like a toggle : creates it if it doesn't exists, and then
      // toggle a boolean
      return api.updateAvailability(id, 'unknown');
    }

    return api;
  }
})();
