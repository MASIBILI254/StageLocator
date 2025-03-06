import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './Routes/userRoutes.js';
import stages from './Routes/stageRoute.js';
import auth from './Routes/AuthRoutes.js';
import stk from './Routes/mpesaRoute.js';
import cors from 'cors';

const app = express();
dotenv.config();

const Port= 3000;
const MONGO_URL="mongodb+srv://andreasimiyu7:2hnoLRl13Hc8awrj@cluster0.g5jht.mongodb.net/stage?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());
app.use('/users', users);
app.use('/stages', stages);
app.use('/auth',auth)
app.use('/stk',stk)
//connect to mongoDB
try {
  mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');
  
} catch (error) {
  console.log(error);
  
}



app.listen(Port, () => {
    console.log(`Example app listening on port ${Port}`);
});