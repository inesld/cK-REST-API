const express = require('express');
const mongoose= require("mongoose");
require("dotenv").config({path:"./src/config/.env"}) // importer les variables d'envirement 
const User = require("./src/models/User.js")

const app = express(); // instance de l'application express
app.use(express.json())


const MONGO_URI=process.env.MONGO_URI
const PORT = process.env.PORT
//connect de mongodb
mongoose
.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connected to Data Base")

    // methode get to recuperer get all users
    app.get('/users', async(req, res) => {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            console.log("Error fetching users:",error)
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

   // POST: Add a new user to the database
   app.post("/new-user", async (req, res) => {
       try {
      const { name, age, favoriteFoods } = req.body;
      const newUser = new User({ name, age, favoriteFoods });
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// PUT: Edit a user by ID
app.put("/users/:id", async (req, res) => {

    try {
      const userId = req.params.id;
      const { name, age, favoriteFoods } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, age, favoriteFoods },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// DELETE: Remove a user by ID
app.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      res.json(deletedUser);
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



    // Démarrer le serveur
  app.listen(PORT, () => {
    console.log( `Server is running on http://localhost:${PORT}`);
});

})
.catch((error) => {
console.error("error to conecting to Data Base:",error)
})




