const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }, // Linking to the cart
    username: { type: String, required: true },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: {
          type: String,
          enum: ["Men", "Women", "Kids", "Bags"],
          required: true,
        },
        brand: { type: String },
        size: { type: String, enum: ["S", "M", "L", "XL", "XXL", "One Size"] },
        color: { type: String },
        discount: { type: Number, default: 0 },
        quantity: { type: Number, required: true, min: 1 },
        images: { type: [String] },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Credit Card", "Debit Card", "UPI"],
      required: true,
    },
    address: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: { type: Number, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
