const validateLoginForm = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send({ message: "email is required" });
    console.log("email is required");
    return;
  }
  if (!password) {
    res.status(400).send({ message: "password is required" });
    console.log("password is required");
    return;
  }
  req.user = { email, password };
  console.log("login form is valid");
  next();
};

const validateSignupForm = async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email) {
    res.status(400).send({ message: "email is required" });
    console.log("email is required");
    return;
  }
  if (!password) {
    res.status(400).send({ message: "password is required" });
    console.log("password is required");
    return;
  }
  if (!name) {
    res.status(400).send({ message: "name is required" });
    console.log("name is required");
    return;
  }
  req.user = { email, password, name };
  console.log("signup form is valid");
  next();
};


const validateUpdateForm = async (req, res, next) => {
  if (!req.body) {
    res.status(400).send({ message: "update form is required" });
    console.log("update form is required");
    return;
  }
  req.updateUser = req.body;
  console.log("update form is valid");
  next();
};

export { validateLoginForm, validateSignupForm,validateUpdateForm };
