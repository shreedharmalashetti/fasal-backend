import express from "express";
const router = express.Router();
import { authenticateJWT } from "../auth/index.js";

import imdb from "imdb-api";
import { Movie } from "../models/index.js";
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

router.get("/add", async (req, res, next) => {
  const id = req.query.id;
  const accessType = req.query.accessType;
  if (!id) return res.status(400).json({ message: "imdbid is required" });
  try {
    let movie = await Movie.findOne({ imdbid: id });
    if (movie)
      return res
        .status(400)
        .json({ message: "movie already exist in database" });

    movie = await imdbClient.get({ id });
    movie.accessType = accessType;
    movie.userId = req.user.id;
    const m = new Movie({ ...movie });
    await m.save();
    res.send(movie);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findOne({
    imdbid: req.params.id,
    userId: req.user.id,
  });
  movie.delete();
  res.json({ message: "done" });
});

router.get("/", async (req, res, next) => {
  try {
    const movies1 = await Movie.find({ userId: req.user.id,accessType:"private" });
    const movies2 = await Movie.find({ accessType: "public" });

    res.send([...movies1, ...movies2]);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

export default router;
