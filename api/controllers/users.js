const User = require("../models/user");
const TokenGenerator = require("../lib/token_generator");

const UsersController = {
  Create: (req, res) => {
    const user = new User(req.body);
    user.save((err) => {
      if (err) {
        res.status(400).json({message: 'Bad request'})
      } else {
        // Generate token after user creation
        const token = TokenGenerator.jsonwebtoken(req.user_id); // Pass user ID for the token
        res.status(201).json({ message: 'OK', token: token });
      }
    });
  },
};

module.exports = UsersController;
