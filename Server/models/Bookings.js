const mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    bookingDate:{
        type:Date,
        required:true,
        unique:false
    },
    timeSlot:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model('Bookings', bookingSchema);