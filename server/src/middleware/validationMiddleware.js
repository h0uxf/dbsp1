// Checks if input is a valid email
module.exports.isValidEmail = function (req, res, next) {
  const email = req.body;

  // Define the regex pattern for a valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email exists and is valid
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid or missing email address.",
    });
  }

  // If email is valid, proceed to the next middleware/route handler
  next();
}
