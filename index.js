import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';

import cors from  'cors';
dotenv.config();
const app = express();

//using middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
app.get('/',(req,res)=>{
    res.send("server is started");
});

app.use("/uploads", express.static("uploads"));

//importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

//using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port, ()=>{
    console.log("server is running at port:",port);
    connectDb();
})
