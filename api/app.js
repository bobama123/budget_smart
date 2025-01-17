const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const JWT = require("jsonwebtoken");

const postsRouter = require("./routes/posts");
const authenticationRouter = require("./routes/authentication");
const usersRouter = require("./routes/users");
const transactionsRouter = require("./routes/transactions");

const app = express();

// setup for receiving JSON
app.use(express.json())

app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// middleware function to check for valid tokens
const tokenChecker = (req, res, next) => {

  let token;
  const authHeader = req.get("Authorization")
  console.log("Authorization Header:", authHeader);

  if(authHeader) {
    token = authHeader.slice(7)
    console.log(token)
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

// route setup
app.use("/posts", tokenChecker, postsRouter);
app.use("/tokens", authenticationRouter);
app.use("/users", usersRouter);
app.use("/transactions", tokenChecker, transactionsRouter);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // respond with details of the error
  res.status(err.status || 500).json({message: 'server error'})
});

module.exports = app;
