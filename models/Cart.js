const mongoose = require('mongoose');
const _ = require("lodash")
const { ObjectId } = mongoose.Schema.Types;
const cartSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        itemId: {
            type: ObjectId,
            ref: 'Item',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    },
    verify: {
        type: Boolean,
        default: false
    }
},
{
    toJSON:{
        transform: (doc,retuDoc)=> _.omit(retuDoc,['__v','_id','createdAt','updatedAt'])
    }
}
, {
    timestamps: true
})

cartSchema.methods.get_bill = function(){
    return this.items.reduce((acc,curr)=>{
        return acc + curr.quantity *curr.price;
    },0)
}
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
