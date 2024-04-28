const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
},
  capacity: {
    type:Number,
    required:true,
},
  facility:{
    type:[String],
    required:true,
    default:[]
  }
});

module.exports = mongoose.model('Room', roomSchema);
