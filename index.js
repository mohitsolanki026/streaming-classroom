import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db.connection.js';
import router from "./routes/index.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('hello from server');
});

app.use('/api', router);

connectDB();

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
