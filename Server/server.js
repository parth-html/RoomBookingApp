// server.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(bodyParser.json());
app.use(express.json());

app.use(cors(
    {
        origin: "http://localhost:3000", // allow the server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }
));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/roomBookingDB') // TODO: make this a .env variable
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/roomBookingDB', // TODO: make this a .env variable
  collection: 'Sessions'
});

app.use(require('express-session')({
    secret: 'This is a secret',   // TODO: make this a .env variable
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
  }));

// Routes
app.use('/api/rooms', require('./routes/BookingRouter'));

// Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
