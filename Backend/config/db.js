const mongoose = require("mongoose");

const connect = mongoose.connect(process.env.MONGO_URI, {
    dbName: "NordStorm", // ✅ Explicit database name
});

module.exports = connect; // ✅ Correctly export the Promise
