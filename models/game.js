var wordModule = require('./word')
  , Word = wordModule.Word
  , MAX_THRESHOLD = 10;

exports.win = function(remainingChars, incorrectGuesses) {
  return remainingChars == 0 && incorrectGuesses < MAX_THRESHOLD;
}

exports.correctGuess = function(clickedChar, finalWord) {
  return finalWord.toUpperCase().indexOf(clickedChar) !== -1;
}