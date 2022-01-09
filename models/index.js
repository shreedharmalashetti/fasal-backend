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
  id: String,
  userId: String,
  accessType: String,

  title: String,
  year: Number,
  languages: String,
  poster: String,
  video:String,
});

const User = db.model("user", userSchema); //model
const Movie = db.model("movie", movieSchema);

const getNewId = () => {
  return new mongoose.Types.ObjectId().toString();
};

export { User, Movie, getNewId };
