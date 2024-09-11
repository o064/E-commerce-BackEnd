const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { checkUser,authAdmin,authUser} = require('./middleware/authorize');
const customErrorMiddleware = require('./middleware/customError');
const UserRoutes= require('./routes/userRoute');
const AdminRoutes= require('./routes/adminRoute');
const CartRoute= require('./routes/CartRoute');
//config
require('dotenv').config();

// database connection
const mongoose = require('mongoose');
mongoose.connect(process.env.db)
.then((result) => app.listen(3000,()=>{
console.log("server is listening.....................");
}))
.catch((err) => console.log(err));
// middleware
app.use(express.json());
app.use(cookieParser());


// routes
//for template and views 
app.use("*",checkUser);
// home page & login & signup
app.get("/",(req,res)=> res.send("Home page"));
app.use("/",UserRoutes);
// admin panel
app.use("/admin",authAdmin,AdminRoutes);
// prodcuts
app.get("/products",(req,res)=> res.send("prodcuts page"));
app.use("/products",authUser,CartRoute);
// 404 not found page
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found"
    });
});
//errors
app.use(customErrorMiddleware);
