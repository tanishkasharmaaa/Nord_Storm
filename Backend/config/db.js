const mongoose = require("mongoose");

const connect = mongoose.connect(process.env.MONGO_URI, {
  dbName: "NordStorm", // ✅ Ensure correct DB name
});

module.exports = connect;

