const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  userOwner: {
    type: String,
    ref: "userId", // Update the reference to match the actual model name
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'userId', // Update the reference to match the actual model name
    required: true,
  },
});

module.exports = mongoose.model("Recipes", recipeSchema);
