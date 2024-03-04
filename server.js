const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

const connectDB = require('./config/db');
//Route files
const massageShops = require('./routes/massageShops')
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

dotenv.config({path:'./config/config.env'});

connectDB();

const app=express();

//add body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attack
app.use(xss());

//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/v1/massageShops',massageShops);
app.use('/api/v1/auth',auth);
app.use('/api/v1/bookings',bookings);

const PORT=process.env.PORT || 5001

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);

    server.close(()=>process.exit(1));
});