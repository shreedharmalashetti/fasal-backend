import db from "./db.js";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  name: String,
  hashedPassword: String,
  id: String,
}); // schema

const User = db.model("user", userSchema); //model

const getNewId = () => {
  return new mongoose.Types.ObjectId().toString();
};

export { User, getNewId };
