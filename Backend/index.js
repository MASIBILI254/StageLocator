import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import users from './Routes/userRoutes.js';
import stages from './Routes/stageRoute.js';
import cors from 'cors';
import reviews from './Routes/reviewRoutes.js';
import incidentReports from './Routes/incidentReportRoutes.js';

const app = express();
dotenv.config();

const Port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors(
   {
    origin:"http://localhost:5137",
    credentials:true,
   }
));



app.use(express.json());
app.use('/users', users);
app.use('/stages', stages);
app.use('/reviews', reviews);
app.use('/incident-reports', incidentReports);

app.get('/', (req, res) => {
  res.send('Server is running and ready to receive M-Pesa callbacks!');
});

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
