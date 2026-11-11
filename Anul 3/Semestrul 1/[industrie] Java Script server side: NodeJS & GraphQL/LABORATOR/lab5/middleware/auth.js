const jwt = require("jsonwebtoken");
const JWT_SECRET = "graphql-secret";

function getUserFromRequest(req){
    const authHeader = req.headers.authorization || "";

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return null;
    }

    const token = authHeader.split(" ")[1];

    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(err){
        console.warn("Invalid token", err);
        return null;
    }

    module.exports = {
        JWT_SECRET,
        getUserFromRequest,
    };
}