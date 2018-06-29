
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout:'main'
});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.set('mysql', mysql);

const path = require('path');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.render('home');
});

app.use('/park', require('./park.js'));
app.use('/land', require('./land.js'));
app.use('/character', require('./character.js'));
app.use('/attraction', require('./attraction.js'));
app.use('/dining', require('./dining.js'));

app.use('/park_land', require('./park_land.js'));
app.use('/park_character', require('./park_character.js'));
app.use('/park_attraction', require('./park_attraction.js'));
app.use('/park_dining', require('./park_dining.js'));

app.use('/park_character_filter', require('./park_character_filter.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
