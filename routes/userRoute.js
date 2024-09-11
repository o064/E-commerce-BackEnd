const express = require('express');
const route = express.Router();
const authControler = require("../controllers/userController")
route.post("/signup",authControler.signUp_post);
route.post("/login",authControler.logIn_post);
route.get("/logout",authControler.get_logout);
route.get("/signup",(req,res)=> res.send("signup page"));
route.get("/login",(req,res)=> res.send("login page"));


module.exports = route;