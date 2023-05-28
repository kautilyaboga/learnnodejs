const mongoose = require('mongoose');

const plantesSchema = new mongoose.Schema({
  keplerName : {
    type : String,
    required : true,
  },

  // These ones are not rrequried.
  // koi_insol : {
  //   type : Number,
  //   required : true,
  // },
  // koi_prad : {
  //   type : Number,
  //   required : true,
  // },
  // koi_disposition : { 
  //   type : String,
  //   required : true
  // },

})

module.exports = mongoose.model('Planet', plantesSchema);