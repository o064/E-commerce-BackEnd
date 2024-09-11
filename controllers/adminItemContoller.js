const Item = require('../models/item');
const createCustomError = require('../customError'); 
const get_items = async (req, res, next) => {
    try {
        const items = await Item.find({});
        if (items.length === 0) {
            return next(createCustomError({ message: "No items found", status: 404 }));
        }
        res.status(200).json({success: true, message: "Items retrived successfully", items });
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

const get_item = async (req, res, next) => {
    const { id } = req.query;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return next(createCustomError({ message: "Item not found", status: 404 }));
        }
        res.status(200).json({success: true, message: "Item retrived successfully", item });
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

const del_item = async (req, res, next) => {
    const { id } = req.query;
    try {
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return next(createCustomError({ message: "Item not found", status: 404 }));
        }
            
            res.status(200).json({success: true, message: "Item deleted successfully", item });
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

const create_item = async (req, res, next) => {
    const { name, price, description, category } = req.body;
    try {
        const item = await Item.create({ name, price, description, category });
        res.status(201).json({success: true, message: "Item created successfully", item });
    } catch (err) {
        next(createCustomError({ message: err.message, status: 400 }));
    }
};

const edit_items = async (req, res, next) => {
    const { id } = req.query;
    const { price, description, category } = req.body;
    try {
        const item = await Item.findByIdAndUpdate(id, { price, description, category }, { new: true, runValidators: true });
        if (!item) {
            return next(createCustomError({ message: "Item not found", status: 404 }));
        }
        res.status(200).json({ success: true,message: "Item updated successfully", item });
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

module.exports = {
    get_items,
    get_item,
    edit_items,
    create_item,
    del_item
};
