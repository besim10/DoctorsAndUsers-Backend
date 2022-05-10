import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});
