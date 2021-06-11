var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors');
var app = express();

app.set('port', 3247);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

const getAllQuery = 'SELECT * FROM workout' ;
const insertQuery = 'INSERT INTO workout (`name`, `reps`, `weight`, `unit`, `date`) VALUES (?, ?, ?, ?, ?)' ;
const updateQuery = 'UPDATE workout SET name=?, reps=?, weight=?, unit=?, date=? WHERE id=?';
const deleteQuery = 'DELETE FROM workout WHERE id=?';
const dropTableQuery = 'DROP TABLE IF EXISTS workout';
const makeTableQuery = `CREATE TABLE workout(
                        id INT PRIMARY KEY AUTO_INCREMENT, 
                        name VARCHAR(255) NOT NULL,
                        reps INT, 
                        weight INT,
                        unit BOOLEAN,
                        date DATE);`;

// unit of 0 is lbs, unit of 1 is kgs



app.get('/', function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  });
});



app.post('/',function(req,res,next){
  var context = {};
  var {name, reps, weight, unit, date} = req.body;
  
  mysql.pool.query(insertQuery, [name, reps, weight, unit, date], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
      if (err) {
        next(err);
        return;
      }
      res.json({rows: rows});
    });
  });
});

app.delete('/',function(req,res,next){
  var context = {};
  var {id} = req.body;
  mysql.pool.query(deleteQuery, [id], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
      if (err) {
        next(err);
        return;
      }
      res.json({rows: rows});
    });
  });
});


///simple-update?id=2&name=The+Task&done=false&due=2015-12-5
app.put('/',function(req,res,next){
  
  var {name, reps, weight, unit, date, id} = req.body;

  
  mysql.pool.query(updateQuery, [name, reps, weight, unit, date, id], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
      if (err) {
        next(err);
        return;
      }
      res.json({rows: rows});
    });
  });
});



app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      res.send('Table Reset');
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:3247/reset-table, press Ctrl-C to terminate.');
});
