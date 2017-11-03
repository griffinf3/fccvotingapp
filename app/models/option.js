// app/models/options.js

var mongoose = require('mongoose');
// define the schema for our option model

var optionSchema = mongoose.Schema({
  userid: String,
  option1: String,
  option2: String
  });

// create the model for options and expose it to our app
module.exports = mongoose.model('Option', optionSchema);