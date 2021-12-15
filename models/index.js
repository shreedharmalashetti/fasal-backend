import db from "./db.js";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  name: String,
  hashedPassword: String,
  id: String,
}); // schema

const movieSchema = new Schema({
  accessType: String,
  actors: String,
  country: String,
  director: String,
  genres: String,
  imdbid: String,
  languages: String,
  plot: String,
  poster: String,
  rating: Number,
  runtime: String,
  title: String,
  year: Number,
  userId: String,
});

const User = db.model("user", userSchema); //model
const Movie = db.model("movie", movieSchema);

const getNewId = () => {
  return new mongoose.Types.ObjectId().toString();
};

export { User, Movie, getNewId };
