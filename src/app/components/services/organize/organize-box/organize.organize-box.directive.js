/* global angular */
(function() {
    'use strict';

    angular
        .module('footer')
        .directive('acmeOrganizeOrganizeBox', acmeOrganizeOrganizeBox);

    /** @ngInject */
    function acmeOrganizeOrganizeBox() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/services/organize/organize-box/organize.organize-box.html',
            controller: acmeOrganizeOrganizeBoxController,
            controllerAs: 'vm',
            scope: {
            }
        };
                
        return directive;
        
        /** @ngInject */
        function acmeOrganizeOrganizeBoxController($rootScope, $scope, organizeModalService, toolsService, eventsService) {
            var vm = this;           
            
            /* Variables */
            vm.query = "";
            vm.players_available = [];
            vm.players_perhaps = [];
            vm.players_unknown = [];
            vm.players_unavailable = [];
            vm.selected = [];
            
            vm.date = "";
            vm.hours = "";
            vm.private = false;
            vm.citadium = 'Urban Foot';
            
            /* Methodes */         
            vm.onUserClick = onUserClick;
            vm.onNextClick = onNextClick;
            vm.onCancelClick = onCancelClick;
            vm.onPreviousClick = onPreviousClick;
            vm.onCreateClick = onCreateClick;
            vm.onPrivateClick = onPrivateClick;
            vm.onRandomClick = onRandomClick;
            vm.search = search;
            vm.isSelected = isSelected;
                                   
            /* Views */
            vm.select = true;
            vm.create = false;    
                                 
            /* Initialize */
            // Go to /* Watcher */
            
            /**
             * Action when the user click on the user in the selection-box
             * Selected the user for the event
             * @method onUserClick
             * @param user
             */
            function onUserClick (user) { 
                if (!removeSelectedUser(user)) {
                    addSelectedUser(user);
                }
            }
            
            /**
             * Action when the user click on the next button in the selection-box
             * Go to the next page
             * @method onNextClick
             */
            function onNextClick () {
                vm.select = false;
                vm.create = true; 
            }
            
            /**
             * Action when the user click on the cancel button in the selection-box
             * Return on the organize-calendar
             * @method onCancelClick
             */   
            function onCancelClick () {
                exitSelect();
                $scope.$parent.switchViews();
            }
            
            /**
             * Action when the user click on the previous button in the selection-box
             * Go to the previous page
             * @method onPreviousClick
             */ 
            function onPreviousClick () {
                vm.select =  true;
                vm.create = false;  
            }
            
            /**
             * Action when the us er click on the create button in the selection-box
             * Create the event
             * Modify database
             * @method onCreateClick
            */ 
            function onCreateClick () {
                eventsService.createEvent(vm.date, vm.hours, 'match', vm.private, vm.selected).then(function () {
                    organizeModalService.initializeOrganizeModalData(function() {
                        $scope.$parent.switchViews();
                        exitSelect();
                    });    
                });
            }
            
            /**
             * Action when the user click on the private/public button in the selection-box
             * Modify the private property
             * @method onPrivateClick
             */
            function onPrivateClick () {
                vm.private = !vm.private;
            }
            
            /**
             * Action when the user click on the random button in the selection-box
             * Random select users for the event
             * @method onRandomClick
             */ 
            function onRandomClick () {
                var list = angular.copy(vm.players_available);
                var index = toolsService.findUserIndex(vm.players_available, $rootScope.user);
                vm.selected = [list.splice(index, 1)[0]];
                while (vm.selected.length < 10 && list.length > 0) {
                    index = Math.floor(Math.random() * list.length);
                    var user = list.splice(index, 1);
                    addSelectedUser(user[0]);
                }
            }
            
            /**
             * Filter used for the search-bar
             * @method search
             * @param user
             */
            function search (user) {
                return  user.lastName.match(toolsService.lowercaseAll(vm.query)) !== null ||
                        user.firstName.match(toolsService.lowercaseAll(vm.query)) !== null;
            }
            
            /**
             * Determines if the user is selected for the match
             * @method isSelected
             * @param user
             * @return bool
             */
            function isSelected (user) {
                return toolsService.findUserIndex(vm.selected, user) !== -1;
            }
            
            /**
             * Add the user in selected[]
             * @method addSelectedUser
             * @param user
             */
            function addSelectedUser(user) {
                vm.selected.push(user);
            }
            
            /**
             * Remove the user in selected[]
             * @method removeSelectedUser
             * @param user
             * @retrun bool
             */
            function removeSelectedUser(user) {
                var index = toolsService.findUserIndex(vm.selected, user);
                if (index > -1) {
                    vm.selected.splice(index, 1);
                    return true;
                }
                
                return false;
            }  
            
            /**
             * Call when the current user close the select-box
             * Reinitialize variables
             * @method exitSelect
             */
            function exitSelect() {
                vm.select = true;
                vm.create = false;
                vm.private = false;
                vm.selected = [];                 
            }
            
            /* Watcher */
            $scope.$parent.$watch('organize', function(organize) {
                if (organize) { 
                    $scope.$parent.initializePlayersAvailabilities().then(function (players) {
                        vm.players_available = players[0];
                        vm.players_perhaps = players[1];
                        vm.players_unknown = players[2];
                        vm.players_unavailable = players[3];
                    });
                    
                    vm.date = $scope.$parent.date;
                    vm.hours = $scope.$parent.hours;
                }    
            });       
        }
    }       
})();