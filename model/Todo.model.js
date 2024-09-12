//packages
let mongoose = require("mongoose");

//Schema creation
let TodoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: Boolean, required: true, trim: true, default:"false" },
},{timestamps: true, versionKey: false});


//Model creation
let TodoModel = mongoose.model("Todo", TodoSchema);

//exporting the model
module.exports = TodoModel;