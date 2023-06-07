require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
let refreshTokens = [];

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccesToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      const accessToken = generateAccesToken({ name: user });
      res.json({ accessToken: accessToken });
    }
  });
});
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function authenticateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
}
function generateAccesToken(user) {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  return accessToken;
}
app.listen(4000);
