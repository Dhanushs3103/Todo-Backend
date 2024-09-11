//Packages
let mongoose = require("mongoose");

//Schema creation
let userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female"],
    },
    todosCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" , default: [] }],
  },
  { timestamps: true, versionKey: false }
);

//Model creation
let UserModel = mongoose.model("User", userSchema);

//exporting the model
module.exports = UserModel;
