const mongoose = require("mongoose");
const { Schema } = mongoose;

// CREATING MONGOOSE SCHEMA
// SCHEMA IS THE BLUE PRINT OF THE DATA THAT WE NEED TO STORE
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedRecipes:{
    type: Array,
    defalut:[]
  }
   ,
});

module.exports = mongoose.model("Users", UserSchema);
