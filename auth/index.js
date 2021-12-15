import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, getNewId } from "../models/index.js";

const jwtSecret = "jksfdkdfsfhsdajklfhrskjlhfaslkhaklsjdhkdsj";

// signup middlewares
// make sure email and name not exists
const checkUserInDb = async (req, res, next) => {
  try {
    let doc = await User.findOne({ email: req.user.email });
    if (doc) {
      res.status(400).json({ message: "user with this mail already exists" });
      return;
    }
    next();
  } catch (error) {
    console.log("checkUserInDb", error);
    next(error);
  }
};

// upload user with profile and hashed password
const uploadUser = async (req, res, next) => {
  try {
    const user = new User();
    user.name = req.user.name;
    user.email = req.user.email;
    const hashedPassword = await bcrypt.hash(req.user.password, 10);
    user.hashedPassword = hashedPassword;
    req.user.hashedPassword = hashedPassword;
    const id = getNewId();
    user.id = id;
    req.user.id = id;

    await user.save();
    next();
  } catch (error) {
    console.log("uploadUser", error);
    next(error);
  }
};

//login middlewares
// get user with email
const getUserFromDb = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      res.status(400).json({ message: "no user found" });
      return;
    }

    req.user = { ...req.user, ...user._doc };
    next();
  } catch (error) {
    console.log("getUserFromDb", error);
    next(error);
  }
};

// compare hashed password get from db with login password
const comparePassword = async (req, res, next) => {
  try {
    const { hashedPassword, password } = req.user;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      res.status(400).json({ message: "password is incorrect" });
      return;
    }
    next();
  } catch (error) {
    console.log("comparePassword", error);
    next(error);
  }
};

// get token(for both login and signup)
const signJwt = async (req, res, next) => {
  try {
    
    const { email, name, password, id } = req.user;
    req.user.token = jwt.sign({ email, name, password, id }, jwtSecret);
    next();
  } catch (error) {
    console.log("signjwt", error);
    next(error);
  }
};

//authentication middleware
// get user from token
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(400).send({ message: "auth header not found" });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(400).send({ message: "auth token not found" });
      return;
    }
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        res.status(400).send({ message: "jwt verify error" });
        return;
      }

      req.user = user;
      req.user.token = token;
      next();
    });
  } catch (error) {
    console.log("authenticateJWT", error);
    next(error);
  }
};

// user update middleware (requires authentication)
const updateUser = async (req, res, next) => {
  try {
    const doc = await User.findOne({ email: req.user.email });
    const { email, name, password } = req.updateUser;

    if (password) {
      doc.hashedPassword = await bcrypt.hash(password, 10);
      req.user.password = password;
    }
    if (email) {
      req.user.email = email;
      doc.email = email;
    }
    if (name) {
      req.user.name = name;
      doc.name = name;
    }
    await doc.save();
    next();
  } catch (error) {
    console.log("updateUser", error);
    next(error);
  }
};

export {
  checkUserInDb,
  uploadUser,
  getUserFromDb,
  comparePassword,
  signJwt,
  authenticateJWT,
  updateUser,
};
