const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    price:{type:Number,required:true},
    category:{
        type:String,enum:['Men',"Women","Kids","Bags"],
        required:true
    },
    brand:{type:String},
    size:{type:[String],enum:["S","M","L","XL","XXL","One Size"]},
    color:{type:String},
    discount:{type:Number,default:0},
    stock:{type:Number,required:true},
    images:{type:[String]},
    rating:{type:Number,min:0,max:5,default:0},
    reviews:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            comment:String,
            rating:{type:Number,min:0,max:5},
            createdAt:{type:Date,default:Date.now},
    }
    ],
},
{timestamps:true}
);

const Product = mongoose.model("Product",productSchema);
module.exports = Product;
