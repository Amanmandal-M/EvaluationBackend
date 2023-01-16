const express = require('express');
const { connection } = require('./Config/db');
const { validator } = require('./Middleware/authenticateMiddleware');
const { PostRouter } = require('./Router/postRouter');
const { UserRouter } = require('./Router/UserRouter');
const cors = require('cors');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Homepage")
})

app.use("/users",UserRouter);
app.use(validator);
app.use("/posts",PostRouter);


app.listen(process.env.port , async ()=>{
    try {
         connection
         console.log(`Connected to Database`);
         console.log(`Connected To Server : ${process.env.port}`);
    } catch (error) {
        console.log(`Error in Connect : ${error}`);
    }
})