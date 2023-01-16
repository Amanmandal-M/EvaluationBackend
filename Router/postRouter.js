const express = require("express");
const { postModel } = require("../Models/postModel");
require('dotenv').config()
const jwt = require('jsonwebtoken')

const PostRouter = express.Router();

PostRouter.get("/", async (req, res) => {
  try {
    const token =req.headers.authorization
    const decoded = jwt.verify(token, process.env.key);
    if (decoded) {
      const userID = decoded.UserID;
      const data = await postModel.find({UserID:userID})
      res.send(data);
    } else {
      res.send("Please Login First");
    }
  } catch (error) {
    console.log(`Error in get post: ${error}`);
    res.send({
      Message: `Error in get post : ${error}`,
    });
  }
});

PostRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const data = new postModel(payload);
    await data.save();
    res.send({
      Message: "Post created successfully",
      Data: data,
    });
  } catch (error) {
    console.log(`Error in /create: ${error}`);
    res.send({
      Message: `Error in /create: ${error}`,
    });
  }
});

PostRouter.patch("/update/:id", async (req, res) => {
  const parameter = req.params.id;
  const payload = req.body;
  try {
    const data = await postModel.findOne({ _id: parameter });
    const dataOfUserID = data.UserID;
    const dataOfReqUserID = req.body.UserID;

    if (dataOfUserID != dataOfReqUserID) {
      res.send({
        Message: "You are not authorized",
      });
    } else {
      const data = await postModel.findByIdAndUpdate(
        { _id: parameter },
        payload
      );
      res.send({
        Message: `Data Updated successfully`,
        Data: data,
      });
    }
  } catch (error) {
    console.log(`Error in /update: ${error}`);
    res.send({
      "Error in update router": `${error}`,
    });
  }
});

PostRouter.delete("/delete/:id", async (req, res) => {
  const parameter = req.params.id;
  try {
    const data = await postModel.findOne({ _id: parameter });
    const dataOfUserID = data.UserID;
    const dataOfReqUserID = req.body.UserID;

    if (dataOfUserID != dataOfReqUserID) {
      res.send({
        Message: "You are not authorized",
      });
    } else {
      const data = await postModel.findByIdAndDelete({ _id: parameter });
      res.send({
        Message: `Data Deleted successfully`,
        Data: data,
      });
    }
  } catch (error) {
    console.log(`Error in /delete: ${error}`);
    res.send({
      "Error in delete router": `${error}`,
    });
  }
});

module.exports = { PostRouter };
