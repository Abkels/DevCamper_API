 const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// const morgan = require('morgan');
const connectDB = require("./config/db");
const errorHandler = require('./middlewares/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xxs = require('xss-clean');
const rateLimit= require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const Reviews = require('./routes/Reviews');
 
// Load env variables
dotenv.config({path: './config/config.env'});

// connect to database
// connectDB(); 

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

// File uploading
app.use(fileupload());

// Sanitize data (Securing the platform)
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross site scripting (XSS) attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});

app.use(limiter);

// Prevent Param Pollution
app.use(hpp());

// Enable CoRS
app.use(cors()); 

// Set Static folder for uploads
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', Reviews);


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