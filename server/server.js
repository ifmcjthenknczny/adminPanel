import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js'
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connected!")
})

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});