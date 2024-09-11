    const Item = require('../models/item');
const Cart = require('../models/cart');
const createCustomError = require('../customError'); 

const get_cart = async (req, res, next) => {
    const owner = req.user.id;
    try {
        const cart = await Cart.findOne({ owner });
        if (cart && cart.items.length > 0) {
            res.status(200).json({
                success: true,
                message: "Cart retrieved successfully",
                cart
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Cart is empty or not found",
                cart: null
            });
        }
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const post_cart = async (req, res, next) => {
    const owner = req.user.id;
    const { itemId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ owner });
        const item = await Item.findById(itemId);
        if (!item) throw createCustomError({ message: "Item not found", status: 404 });
        const price = item.price;
        const name = item.name;
        if (cart) {
            const indexOfItem = cart.items.findIndex((item) => itemId === item.itemId.toString());
            if (indexOfItem > -1) {
                let product = cart.items[indexOfItem];
                product.quantity += quantity;
                cart.bill = cart.get_bill(); 
                cart.items[indexOfItem] = product;
                await cart.save();
                res.status(200).json({
                    success: true,
                    message: "Item quantity updated successfully",
                    cart
                });
            } else {
                cart.items.push({ itemId, name, quantity, price });
                cart.bill = cart.get_bill();
                await cart.save();
                res.status(200).json({
                    success: true,
                    message: "Item added to cart successfully",
                    cart
                });
            }
        } else {
            cart = await Cart.create({
                owner,
                items: [{ itemId, name, quantity, price }],
                bill: price * quantity
            });
            res.status(200).json({
                success: true,
                message: "New cart created and item added",
                cart
            });
        }
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const edit_item_in_cart = async (req, res, next) => {
    const owner = req.user.id;
    const itemId = req.query.itemId;
    const { quantity } = req.body;
    try {
        let cart = await Cart.findOne({ owner });
        if (!cart) throw createCustomError({ message: "Cart not found", status: 404 });
        const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
        if (itemIndex > -1) {
            let item = cart.items[itemIndex];
            item.quantity = quantity;
            cart.bill = cart.get_bill();
            await cart.save();
            res.status(200).json({
                success: true,
                message: "Cart item updated successfully",
                cart
            });
        } else {
            throw createCustomError({ message: "Item not found", status: 404 });
        }
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const del_item_in_cart = async (req, res, next) => {
    const owner = req.user.id;
    const itemId = req.query.itemId;
    try {
        let cart = await Cart.findOne({ owner });
        if (!cart) throw createCustomError({ message: "Cart not found", status: 404 });
        const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            cart.bill = cart.get_bill();
            await cart.save();
            res.status(200).json({
                success: true,
                message: "Item removed from cart successfully",
                cart
            });
        } else {
            throw createCustomError({ message: "Item not found", status: 404 });
        }
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const del_cart = async (req, res, next) => {
    const owner = req.user.id;
    try {
        const cart = await Cart.findOne({ owner });
        if (!cart) throw createCustomError({ message: "Cart not found", status: 404 });
        await cart.deleteOne();
        res.status(200).json({
            success: true,
            message: "Cart deleted successfully",
            cart: null
        });
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const verify_cart = async (req, res, next) => {
    const owner = req.user.id;
    try {
        let cart = await Cart.findOne({ owner });
        if (!cart) throw createCustomError({ message: "Cart not found", status: 404 });
        if (!cart.verify) {
            cart.verify = true;
            await cart.save();
        }
        res.status(200).json({
            success: true,
            message: "Cart verified successfully",
            cart
        });
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const cancel_cart = async (req, res, next) => {
    const owner = req.user.id;
    try {
        let cart = await Cart.findOne({ owner });
        if (!cart) throw createCustomError({ message: "Cart not found", status: 404 });
        if (cart.verify) {
            cart.verify = false;
            await cart.save();
        }
        res.status(200).json({
            success: true,
            message: "Cart verification canceled successfully",
            cart
        });
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

module.exports = {
    get_cart,
    post_cart,
    edit_item_in_cart,
    del_item_in_cart,
    del_cart,
    verify_cart,
    cancel_cart
};
