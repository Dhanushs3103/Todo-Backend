//Packages 
let mongoose = require('mongoose');

//local imports
let MONGO_URI = process.env.MONGO_URI;

//database connection
let connection = mongoose.connect(MONGO_URI)

//exporting the connection
module.exports = connection