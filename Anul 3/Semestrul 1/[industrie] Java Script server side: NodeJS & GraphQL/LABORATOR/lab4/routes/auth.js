const express = require("express");

//importul bibliotecii
const jwt = require("jsonwebtoken");
const router = express.Router();

const {authMiddleware, JWT_SECRET} = require("../middleware/authMiddleware");

const {users} = require("../db");


//POST /auth/login
// Body: {"username": "admin", "password": "123"}
router.post("/login", (req, res) => {
    const {username, password} = req.body || {};

    // if(!username || !password){
    //     return res.status(400).json({error: "Missing param"});
    // }

    const user = users.find(
        (user) => user.username === username && user.password === password,
    )

    if(!user){
        return res.status(401).json({error: "Invalid credentials"});
    }

    const payload = {id: user.id, username: user.username};

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});

    res.json({token});
})

router.get("/me", authMiddleware, (req, res) => {
    res.json({user: req.user});
});


module.exports = router;