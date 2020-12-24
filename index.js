const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
dotenv.config({path : './config/config.env'});

connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(fileupload());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
    windowMs : 10*60*1000,
    max : 100000
});

app.use(limiter);

app.use(hpp());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/altincilar', require('./routes/altinci'));
app.use('/api/v1/basliklar', require('./routes/baslik'));
app.use('/api/v1/entryler', require('./routes/entry'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} in mode ${process.env.NODE_ENV}`);
});


process.on('unhandledRejection' , (err, promise) => {
    console.log(`Error : ${err.message}`);
    server.close();
});


