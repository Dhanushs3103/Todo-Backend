//packages
let mongoose = require("mongoose");

//Schema creation
let BlacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, trim: true },
},{timestamps: true, versionKey: false});


//Model creation
let BlacklistedTokenModel = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);

//exporting the model
module.exports = BlacklistedTokenModel