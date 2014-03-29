var fs = require('fs')
  , _ = require('underscore')
  , WORD_FILE = 'countries.txt'
  , NBSP = '  ';

exports.getRandom = function(req, res) {
  fs.readFile(WORD_FILE, 'utf8', function(err, content) {
    if (err) {
      console.log('An error occurred: ' + err);
    } else {
      var words = content.split('\n')
        , randomWord = words[_.random(0, words.length-1)].toUpperCase()
        , masqueradedWord = masquerade(randomWord)
        , hasSpace = 0
        , letters = {};



      Object.size = function(obj) {
        var size = 0;
        for(key in obj) {
          if(obj.hasOwnProperty(key)) size++;
        }
          return size;
        }


      req.session.word = randomWord;

      req.session.incorrectGuesses = 0;

      //Count the unique letters 


      for(var i = 0; i < randomWord.length; i++){
           if(randomWord.charAt(i) != " "){
           	 l = randomWord.charAt(i);
           }
           
           letters[l] = (isNaN(letters[l]) ? 1 : letters[l] + 1)


      }
      
      req.session.remainingChars = Object.size(letters) - hasSpace;
      req.session.revealedWord = masqueradedWord;

      res.json({word: masqueradedWord});
    }; 
  })
}

var masquerade = function(word) {
  var chars = word.split('');
  return _.map(chars, function(c) {
    if (c === ' ') {
      return ' '
    } else {
      return NBSP;
    }
  });
}

exports.reveal = function(lastRevealedWord, charClicked, finalWord) {
  var chars = finalWord.split('');

  for (var i=0; i < lastRevealedWord.length; i++) {
    if (lastRevealedWord[i] === NBSP && chars[i].toLowerCase() === charClicked.toLowerCase()) {
      lastRevealedWord[i] = chars[i];
    }
  }

  return lastRevealedWord;
}

exports.remainingChars = function(revealedWord) {
  _.filter(revealedWord, function(w) {
    return w == NBSP;
  }).length;
}