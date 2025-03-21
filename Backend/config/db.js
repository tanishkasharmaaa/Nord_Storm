const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGO_URI)

module.exports= connect