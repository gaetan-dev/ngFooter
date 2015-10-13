(function() {
    'use strict';

    angular
        .module('footer')
		.factory('playerModalService', playerModalService); 
      
    /** @ngInject */  
    function playerModalService(ModalService) {
		var api = {};
		
		/* Methodes */ 
		api.showPlayer = showPlayer;
		
		function showPlayer (player) {
			ModalService.showModal({
				templateUrl: 'app/components/team/player/player.modal.html',
				controller: PlayerModalController,
				inputs: {
					player: player
				}
				}).
				then(function(modal) {
					modal.element.show(500);
					modal.close.then(function() {
				});
			});	
	
			function PlayerModalController ($scope, myModalService, close, player) {
				/* Open */
				myModalService.openModal();
				
				/* Variables */
				$scope.player = player;
				
				/* Methodes */
				$scope.close = closeModal;
				
				
				/**
				 * Close the modal
				 * @method closeModal
				 * @param result
				 */
				function closeModal (result) {
					myModalService.closeModal(close, result);
				}
				
				/* Graph Matches */
				$scope.labels_matches = ["Victoire(s)", "Défaite(s)"];
				$scope.data_matches = [player.numberOfVictories, player.numberOfMatches - player.numberOfVictories];
				$scope.colours_matches = ["#97bbcd", "#f7464a"];
				$scope.options_matches = {
					tooltipTemplate: "<%= value %>",
					onAnimationComplete: function()
					{
						this.showTooltip(this.segments, true);
					},
					tooltipEvents: [],
					showTooltips: true,
					tooltipFillColor: "rgba(255,255,255,0)",
					tooltipFontSize: 35,
					tooltipYPadding: -28,
					tooltipXPadding: 6,
					
					percentageInnerCutout : 70,
					
					responsive: false,
					maintainAspectRatio: true,
					
					segmentShowStroke : true,
					segmentStrokeWidth : 8,
		
				}; 
		
				/* Graph Caractéristiques */  
				$scope.labels_charac = ["Endurance", "Physique", "Vitesse", "Accélération", "Dribble", "Passe", "Tir"];      
				$scope.data_charac = [[player.characteristics.Endurance, player.characteristics.Physique,
					player.characteristics.Vitesse, player.characteristics.Accélération, 
					player.characteristics.Dribble, player.characteristics.Passe,
					player.characteristics.Tir]];
				$scope.options_charac = {          
					responsive: false,
					maintainAspectRatio: true,
		
					animation: true,
					animationSteps: 120,
								
					scaleOverride: true,
					scaleSteps: 10,
					scaleStepWidth: 1,
					scaleStartValue: 0
				}; 
				
				/* Graph Ratio */
				$scope.labels_ratio = ['']; 
				$scope.data_ratio = [[0]];
				var score = 0;
				for (var i = 0; i < player.matches.length; i++) {
					$scope.labels_ratio.push(player.matches[i].date);
					score = player.matches[i].win ? score+1 : score-1;
					$scope.data_ratio[0].push(score); 
				}
				$scope.options_ratio =
				{
					responsive: false,
					maintainAspectRatio: true,
					
					animation: true,
					animationSteps: 120,
					
					bezierCurve : false,
					scaleShowGridLines : false,
					scaleShowHorizontalLines: true,
					scaleShowVerticalLines: true,
					scaleShowLabels: false,
					showScale: true,
				};
			}    
		}
		
		return api;
	}
})();
