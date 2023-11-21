// Import necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const RecipesModel = require('../Models/Recipes');
const UserModel = require('../Models/Users');
const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner
  } = req.body;

  // Check if userId is provided in the request body
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  // Create a new recipe instance
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    name: name,
    image: imageUrl,
    ingredients: ingredients,
    instructions: instructions,
    imageUrl: imageUrl,
    cookingTime: cookingTime,
    userOwner: userOwner,
  });

  try {
    // Save the recipe
    const savedRecipe = await recipe.save();

    res.status(200).json({
      createdRecipe: {
        name: savedRecipe.name,
        image: savedRecipe.image,
        ingredients: savedRecipe.ingredients,
        cookingTime: savedRecipe.cookingTime,
        instructions: savedRecipe.instructions,
        _id: savedRecipe._id,
      },
    });
    
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(422).json({ errors: err.errors });
    }
    console.log(err);
    
    // Handle other errors
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Get recipes by user ID
router.get("/getrecipe/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Use userId to filter by user
    const userRecipes = await RecipesModel.find({ userId: id });
    // Return an empty array if no recipes found
    res.json(userRecipes || []);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    //console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Edit Recipe
router.put("/editrecipe", async (req, res) => {
  try {
      let id=req.body.id;
      let rec=req.body.rec;
      const editRecipe = await RecipesModel.findOneAndUpdate(
          { _id: id },
          { $set:
              rec
          } 
      );
      
      //console.log(rec);
      if (!editRecipe) {
          return res.status(400).json({ message: "Error in Editing" })
      }
      res.status(200).json({ message: "Recipe Edited Successfully", data: editRecipe })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" })
  }
})

//Get a particular Recipe
router.get("/recipe-by-id/:id", async (req, res) => {
  try {
      let data = await RecipesModel
          .find({ _id: req.params.id })
      //Check data is Available
      if (!data) {
          return res.status(400).json({ message: "Couldn't find any Document" })
      }
      res.status(200).json({ message: "Sucessfully got your data", data:data })
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" })
  }
})

//Delete a Recipe
router.delete("/delete-recipe/:id", async(req,res)=>{
  try {
      let id=req.params.id
      //console.log(id);
      let recipe= await RecipesModel.findByIdAndDelete({_id:id})
      
      res.status(201).json({message:"Deleted in Successfully",recipe})
  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Internal server error"})
  }
})




module.exports = router;



