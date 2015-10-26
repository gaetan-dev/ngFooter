/* global beforeEach, describe, inject, it, expect */
(function () {
  'use strict';

  describe('Controller: OrganizeOrganizeBoxController', function () {

    /* Variables */
    var scope;
    var $httpBackend;
    var controller;

    /* Methodes Mock*/


    /* Before Each */
    beforeEach(module('footer', function () {

    }));

    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, ENV) {
      /* Init Variables */
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', ENV.api.URL + 'auth/').respond({
        id: 1
      });

      scope = $rootScope.$new();
      var element = '<acme-organize-organize-box></acme-organize-organize-box>';
      element = $compile(element)(scope);
      scope.$digest();
      controller = scope.$$childTail.vm;

      /* Init Methodes Mock*/

    }));


    /* Unit Test */
    it('should add or remove user(s) in the selected array', function () {
      expect(controller.selected.length).toBe(0);
      controller.onUserClick({
        id: 0
      });
      expect(controller.selected.length).toBe(1);
      controller.onUserClick({
        id: 0
      });
      expect(controller.selected.length).toBe(0);
      controller.onUserClick({
        id: 1
      });
      expect(controller.selected.length).toBe(1);
    });
  });
})();
