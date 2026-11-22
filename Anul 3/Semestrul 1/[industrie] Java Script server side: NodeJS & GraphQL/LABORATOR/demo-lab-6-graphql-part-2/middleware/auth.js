const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "graphql-secret";

function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.warn(err);
    return null;
  }
}

function requireUser(context) {
  if (!context.user) {
    throw new GraphQLError("You must be logged in!");
  }

  return context.user;
}

module.exports = { getUserFromRequest, requireUser, JWT_SECRET };
