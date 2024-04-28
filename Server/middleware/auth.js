// Middleware to check if session exists and user is logged in
const sessionChecker = (req, res, next) => {
    if (req.session.userId) {
      next(); // User is authenticated, proceed to the next middleware
    } else {
      res.status(401).json({ message: 'Unauthorized' }); // Unauthorized, send 401 response
    }
  };


  module.exports = {sessionChecker};