
/*
 * GET home page.
 */
var wordModule = require('../models/word'),
    Game = require('../models/game'),
    Word = require('../models/word'),
    MAX_INCORRECT_GUESSES = 10;

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.new_game = function(req, res) {
  Word.getRandom(req, res);
}

exports.check = function(req, res) {
  var session = req.session
    , params  = req.body
    , finalWord = session.word
    , clickedChar = params.clickedChar
    , correctGuess = Game.correctGuess(clickedChar, finalWord);

  if (correctGuess) {
    session.revealedWord = Word.reveal(session.revealedWord, clickedChar, finalWord);
    session.remainingChars -=1;
  } else {
    session.incorrectGuesses += 1;
  }

  var winning = Game.win(session.remainingChars, session.incorrectGuesses);

  res.json({
    word: session.revealedWord,
    correctGuess: correctGuess,
    incorrectGuesses: session.incorrectGuesses,
    remainingChars: session.remainingChars,
    win: winning
  });
}

exports.answer = function(req, res) {
  var session = req.session;

  if (session.incorrectGuesses < MAX_INCORRECT_GUESSES && session.remainingChars > 0) {
    res.json({success: -1, message: "You haven't finished the game yet"});
  } else {
    res.json({success: 1, answer: session.word});
  }
}