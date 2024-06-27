import express from 'express';
import axios from 'axios';
import querystring from 'querystring';
import cors from 'cors';
import session from 'express-session';
import ytsr from 'ytsr';
import ytdl from 'ytdl-core';
import cookieParser from 'cookie-parser';
import { connectDB } from "./config/dbConnection.js";
import route from './routes/route.js'


// Connecting to database
connectDB();

const app = express();
const port = 5000;


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Routes for Api
app.use('/',route);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});