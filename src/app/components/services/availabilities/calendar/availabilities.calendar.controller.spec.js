(function () {
  'use strict';

  describe('Controller: AvailabilityCalendarController', function () {

    /* Variables */
    var scope;
    var $httpBackend;
    var controller;

    /* Variables Mock */
    var calendarServiceMock;
    var availabilitiesServiceMock;


    /* Before Each */
    beforeEach(module('footer'));

    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, ENV) {
      /* Init Variables */
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', ENV.api.URL + 'auth/').respond({
        id: 1
      });

      scope = $rootScope.$new();
      var element = '<acme-availabilities-calendar />';
      element = $compile(element)(scope);
      scope.$digest();
      controller = scope.$$childTail.vm;

      /* Init Variables Mock */
      calendarServiceMock = {

      };

      availabilitiesServiceMock = {

      };
    }));

    /* Unit Test */
    it('should return false when date is in a past', function (moment) {
    
    });
  });
})();
