/* global beforeEach, describe, inject, it, expect */
(function() {
    'use strict';
  
    describe('Controller: OrganizeModalController', function () {
        
        /* Variables */
        var calendarServiceMock;
        var controller;
        
        /* Methodes Mock*/
        
        /* Before Each */
        beforeEach(module('footer'));
        
        beforeEach(inject (function ($controller) { 
            /* Init Variable */
            calendarServiceMock = {
                fetchAvailabilities: function () {
                    return [
                        {
                            mode: 'available',
                            user: {
                                id: 0
                            }  
                        },
                        {
                            mode: 'perhaps',
                            user: {
                                id: 1
                            }  
                        },
                        {
                            mode: 'unknown',
                            user: {
                                id: 2
                            }  
                        },
                        {
                            mode: 'unavailable',
                            user: {
                                id: 3
                            }  
                        },
                    ];   
                }
                
                /* Init Methodes Mock*/
                
            };
             
            controller = $controller('OrganizeModalController', {
                calendarService: calendarServiceMock,
                close: {},
                availabilities: [],
                events: [],
            });
        }));
  
        
        /* Unit Test */
        it('should switch views between calendar and organize', function () {
            expect(controller.calendar).toBeTruthy();
            expect(controller.organize).toBeFalsy();
            controller.switchViews();
            expect(controller.calendar).toBeFalsy();
            expect(controller.organize).toBeTruthy();
        });
        
        it('should initialize the availabilities arrays players', function () {
            controller.initializePlayersAvailabilities().then(function (players) {
                expect(players.length).toBe(4);
            });
        });
    });
})();
