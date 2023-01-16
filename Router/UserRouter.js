const express = require("express");
const { userModel } = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, secure_pass) => {
      if (err) {
        res.send({
          "Error in Hashing": `${err}`,
        });
        console.log(`Error in Hashing: ${err}`);
      } else {
        const data = new userModel({
          name,
          email,
          gender,
          password: secure_pass,
        });
        await data.save();
        res.send({
          Message: "Successfully Registered"
        });
      }
    });
  } catch (error) {
    res.send({
      Message: error.message,
    });
    console.log(`Error in /register: ${error}`);
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.find({ email });
    if (userData.length > 0) {
      bcrypt.compare(password, userData[0].password, async (err, result) => {
        if (err) {
          res.send({
            Message: "wrong Credentials",
          });
          console.log(`Error in Comparing Password: ${err}`);
        } else {
          const token = jwt.sign({UserID: userData[0]._id }, process.env.key);
          res.send({
            Message: "Login successful",
            Token: token,
            Data: userData,
          });
        }
      });
    } else {
        res.send({
            "Message": "Login failed",
        })
    }
  } catch (error) {
    res.send({
      Message: error.message,
    });
    console.log(`Error in /login: ${error}`);
  }
});

module.exports = { UserRouter };
