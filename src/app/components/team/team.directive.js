/* global angular */
(function() {
    'use strict';

    angular
        .module('footer')
        .directive('acmeTeam', acmeTeam);

    /** @ngInject */
    function acmeTeam() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/team/team.html',
            scope: {
            },
            controller: TeamController, 
            controllerAs: 'vm',
            bindToController: true
      };

      return directive;

      /** @ngInject */
      function TeamController($scope, playerModalService) { 
          var vm = this; 
          
          vm.players = [
              { 
                'name': 'Meynier',
                'firstName': 'Gaëtan',
                'position': 'Défenseur',
                'numberOfMatches': '6',
                'numberOfVictories': '4',
                'numberOfGoals': '4',
                'characteristics': 
                {
                  'Endurance': 8,
                  'Vitesse': 8,
                  'Accélération': 8,
                  'Dribble': 6,
                  'Passe': 7,
                  'Tir': 6,
                  'Physique': 9
                },
                'matches':
                [
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': true
                  },
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': true
                  },
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': false
                  },
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': true
                  },
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': false
                  },
                  {
                    'date': '01/01/1901',
                    'score': '4-2',
                    'win': true
                  },
                ]
              },
              {
                  'name': 'Nom',
                  'firstName': 'Prenom',
                  'position': 'Poste',
                  'numberOfMatches': '-1',
                  'numberOfVictories': '-1',
                  'numberOfGoals': '-1'
                },
                { 
                  'name': 'Nom',
                  'firstName': 'Prenom',
                  'position': 'Poste',
                  'numberOfMatches': '-1',
                  'numberOfVictories': '-1',
                  'numberOfGoals': '-1'
                },
                { 
                  'name': 'Nom',
                  'firstName': 'Prenom',
                  'position': 'Poste',
                  'numberOfMatches': '-1',
                  'numberOfVictories': '-1',
                  'numberOfGoals': '-1'
                },
              {
                  'name': 'Nom',
                  'firstName': 'Prenom',
                  'position': 'Poste',
                  'numberOfMatches': '-1',
                  'numberOfVictories': '-1',
                  'numberOfGoals': '-1'
                },
            ];
      
            // Modal
            $scope.showPlayer = function(player) {         
                playerModalService.showPlayer(player);
            };         
        }
    }
})();
