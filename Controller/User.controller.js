const UserRouter = require("express").Router();
const UserModel = require("../Models/Users");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// GET ALL THE USERS
UserRouter.get("/userId", (req, res, next) => {
  UserModel.find()
    .then((cursor) => {
      if (cursor && cursor.length > 0) {
        return res.status(200).json({
          data: cursor,
          success: true,
          message: "Users fetched successfully!!!",
        });
      } else {
        return res.status(200).json({
          data: [],
          success: true,
          message: "No Data Found!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        success: false,
        message: "Error Fetching Users Data!!!",
        error: err,
      });
    });
});


//get the single user

UserRouter.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Log the userId to verify that it's correctly extracted
  //console.log('userId:', userId);
  try {
    const result = await UserModel.find({_id:userId});
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
  // Use the userId in your Mongoose query to fetch user data
  
});

//register user 
UserRouter.post("/create", (req, res, next) => {
  const data = req.body;
  let hashedPassword;

  bcrypt
    .hash(req.body.password, saltRounds)
    .then(function (hash) {
      hashedPassword = hash;

      const User = new UserModel({
      
        email: data.email,
        username: data.username, 
        password: hashedPassword,
      });

      User.save()
        .then((result) => {
          if (result && result._id) {
            return res.status(200).json({
              message: "User Created Successfully!!",
              data: result,
            });
          }
        })
        .catch((err) => {
          return res.status(401).json({
            message: "Alas! Error Creating User!!",
            error: err,
          });
        });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Error Hashing Password!!",
        error: err,
      });
    });
});

// Update a recipe by ID
UserRouter.put("/update", async (req, res) => {
  try {
    let user = await UserModel.findOne({_id:req.body.userId})
    
    const save=[...user.savedRecipes]
    const id =req.body.userId;
    const updateFields = req.body.recipeID;
    if(!save.includes(updateFields))
    save.push(updateFields)
    // Find the recipe by ID and update the specified fields
    const updatedRecipe = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: {savedRecipes:save} },
      );
      console.log(updatedRecipe)
    if (!updatedRecipe) {
      return res.status(404).json({ message: "No recipe data found with this id!" });
    }
   //console.log(save, updateFields)
    res.json({updatedRecipe});
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = UserRouter;