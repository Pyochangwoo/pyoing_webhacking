const connection = require('./db.js');

function loginUser(username, password, callback) {
  connection.query(
    `SELECT * FROM user_info WHERE name = '${username}' AND password = '${password}'`,
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        return callback('error');
      }

      if (rows.length > 0) {
        return callback('success');
      }

      return callback('fail');
    }
  );
}

module.exports = loginUser;