var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var dateFormat = require('dateformat');


//for local machine use only
// var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';
var PORT = process.env.PORT || 3000;
// json method
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res){
  res.render('index');;
});


app.get('/portfolio', function(req, res){
  res.render('portfolio');;
});

app.get('/blog', function(req, res){
  pg.connect(connectionString, function(err, client, done){
      client.query('select * from posts', function(err, result) {
        res.render('blog', { posts: result.rows, dateFormat: dateFormat});
        console.log(result.rows);
        done();
        pg.end();
      });
    });
});


app.post('/blog', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var timeNow = new Date();
    client.query(`insert into posts (date,title,body) values ('${timeNow.getTime()}','${req.body.title}','${req.body.body}')`, function(err, result) {
      console.log(err);
      console.log(req.body.title);
      console.log(req.body.body);
      res.redirect('/blog');
      done();
      pg.end();
    });
  });
});


app.listen(PORT, function(){
  console.log("Listening on port "+ PORT)
})
