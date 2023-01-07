import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());

const port = process.env.PORT || 4000;

app.listen(port, console.log(`App server running on port ${port}`));