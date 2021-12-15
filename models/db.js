import mongoose from "mongoose";
const uri =
  "mongodb+srv://shree3103:Shreedhar@3103@cluster0.tf278.mongodb.net/fasal?retryWrites=true&w=majority";

const db = mongoose.createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

db.once("open", () => {
  // we're connected!
  console.log("connected to database");
});

export default db;
