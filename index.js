var pg = require('pg');
var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var dateFormat = require('dateformat');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog';

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


//
// app.get('/', function(req, res){
//
// });

// app.post('/pages', function(req, res){
//   pg.connect(connectionString, function(err, client, done){
//     client.query(`insert into messages (title,body) values ('${req.body.title}','${req.body.msg}')`, function(err, result) {
//       res.redirect('/pages');
//       done();
//       pg.end();
//     });
//   });
// });
//
// app.get('/pages/:id', function(req,res){
//   pg.connect(connectionString, function(err, client, done){
//     var page_id = req.params.id;
//     client.query(`select * from messages where id = '${page_id}'`, function(err, result) {
//       res.render('message', { message: result.rows[0]});
//       console.log('get msg: ' + result.rows[0]);
//       done();
//       pg.end();
//     })
//   })
// });
//
// app.get('/delete/users/:id', function(req,res)){
//   pg.connect(login+dbname, function(err, client, done){
//     var userid = req.params.id;
//     client.query(`delete from users where id='${userid}'`, function(err, result){
//       console.log(err);
//
//       res.redirect('/users');
//       done();
//       pg.end();
//     })
//   })
// }

app.listen(8080, function(){
  console.log("Listening on port 8080")
})
