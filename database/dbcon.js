var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_lopezet',
  password        : '9224',
  database        : 'cs290_lopezet'
});

module.exports.pool = pool;
