import express from "express";

import {
  authenticateJWT,
  checkUserInDb,
  getUserFromDb,
  comparePassword,
  signJwt,
  uploadUser,
  updateUser,
} from "../auth/index.js";

import {
  validateLoginForm,
  validateSignupForm,
  validateUpdateForm,
} from "../auth/validate.js";

const router = express.Router();

// login
router.post(
  "/signin",
  validateLoginForm, //copy body to user
  getUserFromDb, //get hash password from mail
  comparePassword, //check password
  signJwt, //get user with token
  (req, res) => {
    const { email, name, id, token } = req.user;
    console.log(req.user);
    res.send({ email, name, id, token });
  }
);

// signup
router.post(
  "/signup",
  validateSignupForm, //copy body to user
  checkUserInDb, //check whether email and name exist
  uploadUser, //upload user with profile(optional)
  signJwt, //get token
  (req, res) => {
    const { email, name, id, token } = req.user;
    console.log(req.user);
    res.send({ email, name, id, token });
  }
);

// user update
router.put(
  "/update",
  validateUpdateForm, //validate and copy body to updateUser
  authenticateJWT, //get user with token
  updateUser, //updateUser to user(email,password,name,password)
  signJwt, //get token
  (req, res) => {
    const { email, name, id, token } = req.user;
    console.log(req.user);
    res.send({ email, name, id, token });
  }
);

router.get("/", authenticateJWT, (req, res) => {
  res.json(req.user.name);
});

export default router;
