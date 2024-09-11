const mongoose = require('mongoose');
const _ = require('lodash');
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name should be more than 3 characters"],
        trim:true,
        unique: [true, "Product name must be unique"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    description: {
        type: String,
        trim:true,
        required: [true, "Description is required"],
        minlength: [10, "Description should be more than 10 characters"]
    },category: {
        type: String,
    }
},
{
    toJSON:{
        transform: (doc,retuDoc)=> _.omit(retuDoc,['__v','_id','createdAt','updatedAt'])
    }
}
,{timestamps:true});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
