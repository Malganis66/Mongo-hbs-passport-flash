import { Router } from "express";
import { body } from "express-validator";
import {
  accountConfirmed,
  CloseSession,
  LoginControllerForm,
  LoginControllerUser,
  RegisterControllerForm,
  RegisterControllerUser,
} from "../controllers/auth.controller.js";
const router = Router();

router.get("/register", RegisterControllerForm);
router.post(
  "/register",
  [
    body("userName", "Invalid username")
      .trim()
      .isLength({ min: 6 })
      .notEmpty()
      .escape(),
    body("email", "Invalid email").isEmail().normalizeEmail().trim(),
    body("password", "Invalid password 6 characters are required")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("There is no coincidence in the passwords");
        }
        return value;
      }),
  ],
  RegisterControllerUser
);
router.get("/confirm/:token", accountConfirmed);
router.get("/login", LoginControllerForm);
router.post(
  "/login",
  [
    body("email", " ").isEmail().normalizeEmail().trim(),
    body("password", "Please check your email or password")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  LoginControllerUser
);

router.get('/logout',CloseSession)

export default router;
