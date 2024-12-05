import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './db.connection.js';
import router from "./routes/index.js";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2, 'https://mercury-uat.phonepe.com'],
    credentials: true
}));
app.use(morgan('dev'));


app.use('/api', router);
app.get('/', (req, res) => {
    res.send('hello from server');
});

connectDB();

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
