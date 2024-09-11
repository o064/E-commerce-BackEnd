const express = require('express');
const route = express.Router();
const {
    get_cart,
    post_cart,
    edit_item_in_cart,
    del_item_in_cart,
    del_cart,
    verify_cart,
    cancel_cart
} = require('../controllers/CartController');
route.get("/cart",get_cart);
//add product to cart
route.post("/cart",post_cart);
route.delete("/cart/item",del_item_in_cart);
route.delete("/cart",del_cart);
route.patch("/cart/item",edit_item_in_cart);
route.patch("/cart/cancel",cancel_cart);
route.patch("/cart/verify",verify_cart);

module.exports = route;
