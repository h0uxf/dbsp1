const pool = require('../config/db');

module.exports.findUserByEmail = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM users WHERE email = $1;
  `;
  const VALUES = [data.email];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.retrieveByUsername = function retrieveByUsername(username) {
    const sql = 'SELECT * FROM member WHERE username = $1';
    return query(sql, [username]).then(function (result) {
        const rows = result.rows;
        return rows[0];
    });
};