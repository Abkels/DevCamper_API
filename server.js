const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const errorHandler = require('./middlewares/error');

// Route files
const bootcamps = require('./routes/bootcamps')
 
// Load env variables
dotenv.config({path: './config/config.env'});

// connect to database
// connectDB();

const app = express();
app.use(express.json());

// mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, ()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on('unhandledRejection',(err, promise)=> {
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(()=> process.exit(1));
})

// uncaught exception handler
process.on('uncaughtException',(err, promise)=>{
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(()=> process.exit(1));
})