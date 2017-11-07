// app/models/poll.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model

var pollSchema = mongoose.Schema({
  userid: String,
  date: { type: Date, default: Date.now },
  poll: {
    question:  String,
    showcase:  Boolean,
    options: [{}],
    public: Boolean;
  }
});


// create the model for polls and expose it to our app
module.exports = mongoose.model('Poll', pollSchema);