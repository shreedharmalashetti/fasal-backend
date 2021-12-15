import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.js";
import moviesRoute from "./routes/movies.js";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/movies", moviesRoute);
app.get("/", (req, res) => {
  res.send("hello world");
});

const server = app.listen(PORT, () => {
  console.log(` server running at http://localhost:${PORT}/`);
});
