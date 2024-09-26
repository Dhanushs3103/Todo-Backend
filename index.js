//Packages
let dotenv = require('dotenv').config();
let express = require('express');
let colors  = require('colors');
let cors = require('cors');
const morgan = require("morgan");

//local imports
let PORT = process.env.PORT || 3000;
let connection = require('./config/db.config.js');
let authRouter = require('./routes/auth.routes.js');


//initializing express
let app = express();

//middlewares
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json()); //for parsing req.body
app.use("/api/auth",authRouter); //parent route
app.use(morgan("combined"))


//Basic home route
app.get('/', (req, res) => {
    res.send('Server is up and running');
})

app.listen(PORT, async () =>{
    try {
       await connection;
       console.log(`Server is running on port ${PORT} and connected to database`.blue.italic );
    } catch (error) {
        console.log(error);
    }
}) 