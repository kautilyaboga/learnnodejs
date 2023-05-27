const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber : {
    type: Number,
    required : true,
    default : 1,
    // min : 100,
    // max:999,
  },
  launchDate : {
    type : Date,
    required : true,
  },
  mission : {
    type : String,
    required : true,
  },
  rocket : {
    type : String,
    required : true,
  },
  target: {
    // If we want to reference the data from the planets table
    // ref: 'Planet',
    // type : mongoose.ObjectId,
    type: String,
    required : true,
  },
  upcoming : {
    type : Boolean,
    required : true,
  },
  success : {
    type : Boolean,
    required : true,
    default : true,
  },
  customers : [String],

})