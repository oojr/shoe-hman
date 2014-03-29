'use strict';


angular.module('hman', ['ui.bootstrap', 'ngStorage', 'ngAnimate'])
  .controller('GameCtrl', function ($scope, $http, $modal, $localStorage, $element) {

  	$scope.$storage = $localStorage.$default({           
                          hman: {"wins":0, "loses":0}                             
                       });
    

  var MAX_INCORRECT_GUESSES = 10,
      GAME_OVER_MESSAGE = "Sorry! You've lost the game. Please start a new one";

  $scope.characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'X', 'Y', 'Z', 'W', '&'
  ];

  $scope._initGameData = function() {
    $scope.word = [];
    $scope.newGame = false;
    $scope.incorrectGuesses = 0;
    $scope.usedChars = [];
    $scope.gamePlayed = false;
    $scope.correctAnswer = '';
  }
   
  $scope._initGameData();

  $scope.startNew = function() {
    $http({
      method: 'POST',
      url: '/new_game'
    })
    .success(function(data, status, headers, config) {
      $scope._initGameData();
      $scope.word = data.word;
      $scope.newGame = true;
      document.getElementById('new-button').blur();
    })
  }

  $scope.checkGuess = function(clickedChar) {
    if ($scope.usedChars.indexOf(clickedChar) !== -1) {
      return;
    }

    if ($scope.lostGame()) {
      $scope._alertGameOver();
      return;
    }
    $scope.checkEmptyChar = function(char){
    	if(char == " "){
    		return true;
    	} else{
    		return false;
    	}
    }

    $http({
      method: 'POST',
      url: '/check',
      data: {clickedChar: clickedChar}
    })
    .success(function(data, status, headers, config) {
      $scope.incorrectGuesses = data.incorrectGuesses;
      $scope.word = data.word;
      $scope.usedChars.push(clickedChar);


      setTimeout(function() {
      	if(data.win && !$scope.gamePlayed){
      	  $localStorage.hman.wins += 1
      	  $scope.gamePlayed = true;
      	  $scope._alertYouWin();
         }
        if($scope.lostGame() && !$scope.gamePlayed){
        	$localStorage.hman.loses +=1;
        	$scope.gamePlayed = true;

        }
        if ($scope.lostGame()) {
          $scope._alertGameOver();
        }
      }, 300);
    })
  }

  $scope.lostGame = function() {
    return $scope.incorrectGuesses >= MAX_INCORRECT_GUESSES
  }


  $scope._alertGameOver = function() {
       $modal.open({
           templateUrl: 'tpls/gameover.html',
           controller: 'ModalInstanceCtrl'
       });
  }
  $scope._alertYouWin = function(){
  	   $modal.open({
           templateUrl: 'tpls/win.html',
           controller: 'ModalInstanceCtrl'
       });
  }

  $scope.showAnswer = function() {
    $http({
      method: 'POST',
      url: '/answer'
    })
    .success(function(data, status, headers, config) {
      
      $scope.correctAnswer = data.answer;
    })
  }

}).controller('ModalInstanceCtrl', function ($scope, $modalInstance){
	$scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };


})


