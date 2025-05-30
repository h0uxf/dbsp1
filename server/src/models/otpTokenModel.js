const pool = require("../config/db");

module.exports.createOtpToken = (data, callback) => {
  const SQLSTATEMENT = `
    INSERT INTO otp_tokens (user_id, otp_code, expires_at, delivery_method)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const VALUES = [data.user_id, data.otp_code, data.expires_at, data.delivery_method];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.findValidOtp = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM otp_tokens
    WHERE user_id = $1 AND otp_code = $2 AND expires_at > NOW()
    ORDER BY expires_at DESC
    LIMIT 1;
  `;
  const VALUES = [data.user_id, data.otp_code];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteOtpToken = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM otp_tokens WHERE id = $1;
  `;
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
