const JWT = require("jsonwebtoken");


// middleware function to check for valid tokens
const tokenChecker = (req, res, next) => {

    let token;
    const authHeader = req.get("Authorization")
    console.log("Authorization Header:", authHeader);
  
    if(authHeader) {
      token = authHeader.slice(7)
      console.log("Token:", token);
    }
  
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }
  
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if(err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
  
      } else {
        console.log("Token Payload:", payload);
        req.user_id = payload.user_id;
        next();
      }
    });
};

module.exports = tokenChecker;
