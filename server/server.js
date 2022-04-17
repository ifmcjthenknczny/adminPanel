import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js';
import 'dotenv/config';
// import path from 'path';

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
// process.env.PWD = process.cwd();
// app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public/"));
app.use(express.json());
app.use(cors());

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connected!")
})

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});