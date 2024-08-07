import "dotenv/config";
import express from "express";
import cors from "cors";
import { productsRoute } from "./routes/products";
import { recipeRoute } from "./routes/recipe";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/products", productsRoute);
app.use("/recipe", recipeRoute);

app.listen(PORT, () => console.log(`Server Running port ${PORT}`));
