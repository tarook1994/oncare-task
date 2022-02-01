import validator from "validator";

export const validateRegisterBody = (req, res, next) => {
  const errors = [];
  const { firstName, lastName, email, password } = req.body;
  if (validator.isEmpty(firstName)) {
    errors.push("First name missing.");
  }
  if (validator.isEmpty(lastName)) {
    errors.push("Last name missing.");
  }
  if (!validator.isEmail(email)) {
    errors.push("Invalid Email.");
  }
  if (validator.isEmpty(password)) {
    errors.push("Password missing.");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
