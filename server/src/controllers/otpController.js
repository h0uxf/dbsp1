const otpModel = require("../models/otpTokenModel");
const userModel = require("../models/userModel");

// Helper to generate 6-digit OTP
function generateOtp() {
  return "" + Math.floor(100000 + Math.random() * 900000);
}

module.exports.requestOtp = (req, res, next) => {
  const { email, deliveryMethod } = req.body;

  if (!email || !deliveryMethod) {
    res.status(400).json("Error: email and delivery method are required");
    return;
  }

  userModel.findUserByEmail({ email }, (err, userResults) => {
    if (err) {
      console.error("Error finding user:", err);
      res.status(500).json(err);
      return;
    }
    if (!userResults.rows || userResults.rows.length === 0) {
      res.status(404).json("Error: user not found");
      return;
    }

    const user = userResults.rows[0];
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const data = {
      user_id: user.id,
      otp_code: otp,
      expires_at: expiresAt,
      delivery_method: deliveryMethod,
    };

    otpModel.createOtpToken(data, (err, otpResults) => {
      if (err) {
        console.error("Error creating OTP token:", err);
        res.status(500).json(err);
        return;
      }

      // TODO: send OTP via email or SMS here

      res.status(200).json({ message: "OTP sent" });
    });
  });
};

module.exports.verifyOtp = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json("Error: email and otp are required");
    return;
  }

  userModel.findUserByEmail({ email }, (err, userResults) => {
    if (err) {
      console.error("Error finding user:", err);
      res.status(500).json(err);
      return;
    }
    if (!userResults.rows || userResults.rows.length === 0) {
      res.status(404).json("Error: user not found");
      return;
    }

    const user = userResults.rows[0];

    otpModel.findValidOtp(
      { user_id: user.id, otp_code: otp },
      (err, otpResults) => {
        if (err) {
          console.error("Error finding OTP:", err);
          res.status(500).json(err);
          return;
        }
        if (!otpResults.rows || otpResults.rows.length === 0) {
          res.status(401).json("Error: invalid or expired OTP");
          return;
        }

        const validOtp = otpResults.rows[0];

        otpModel.deleteOtpToken({ id: validOtp.id }, (err) => {
          if (err) {
            console.error("Error deleting OTP token:", err);
            res.status(500).json(err);
            return;
          }

          // TODO: generate JWT here
          const token = "jwt-token-placeholder";

          res.status(200).json({ message: "OTP verified", token });
        });
      }
    );
  });
};
