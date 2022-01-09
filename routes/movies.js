import express from "express";
const router = express.Router();
import { authenticateJWT } from "../auth/index.js";

import imdb from "imdb-api";
import { Movie, getNewId } from "../models/index.js";
const API_KEY = "74898c04";

const imdbClient = new imdb.Client({ apiKey: API_KEY });

router.use(authenticateJWT);

router.get("/search", async (req, res, next) => {
  const queryData = req.query;

  if (!queryData.name)
    return res.status(400).json({ message: "movie name is required" });
  try {
    const movie = await imdbClient.search(queryData);
    res.send(movie.results);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findOne({ id });
    if (!movie)
      return res.status(400).json({ message: "no movie found with this id" });
    res.json(movie);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const movies1 = await Movie.find({
      userId: req.user.id,
      accessType: "private",
    });
    const movies2 = await Movie.find({ accessType: "public" });

    res.send([...movies1, ...movies2]);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const m = new Movie({ ...req.body });
    m.userId = req.user.id;
    m.id = getNewId();
    await m.save();
    res.json({ message: "movie added successfully", id: m.id,userId:m.userId });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    await Movie.findOneAndUpdate({ id: req.params.id }, { ...req.body });
    res.json({ message: "movie updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOne({
      id: req.params.id,
      userId: req.user.id,
    });
    movie.delete();
    res.json({ message: "done" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

export default router;
