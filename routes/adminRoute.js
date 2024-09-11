const express = require('express');
const route = express.Router();
const {getUsers,makeadmin,deluser} = require("../controllers/adminUserControler");
const {get_items,get_item,edit_items,create_item,del_item} = require("../controllers/adminItemContoller");

route.get("/",(req,res)=> res.send("admin panel page"));

//manage users
route.get("/users",getUsers);
route.patch("/makeadmin/:id",makeadmin);
route.delete("/users/:id",deluser);
//items
route.get("/items",get_items);
route.get("/item",get_item);
route.post("/item",create_item);
route.patch("/item",edit_items);
route.delete("/item",del_item);
module.exports = route;
// 
