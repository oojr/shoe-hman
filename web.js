var http = require('http');
var express = require('express');
var routes = require('./routes');
var app = module.exports = express();
var path = require('path');



app.configure(function(){
  
  app.engine('.html', require('ejs').renderFile)
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
  app.use(express.session({
    secret: 'secret_key',
    store: express.session.MemoryStore({
      reapInterval: 60000 * 10
    })
  }));
  
  
});

 



 


 
app.get('/', routes.index);
app.post('/new_game', routes.new_game);

app.post('/check', routes.check);

app.post('/answer', routes.answer);






var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});