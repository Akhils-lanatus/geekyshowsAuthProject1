import express from "express";
import {
  ChangePassword,
  GetUser,
  LoginUser,
  RegisterUser,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

//USER-REGISTER || POST
router.post("/register", RegisterUser);

//USER-LOGIN || POST
router.post("/login", LoginUser);

//GET-USER || GET
router.get("/get-user", verifyJWT, GetUser);

//CHANGE-PASSWORD || PATCH
router.patch("/change-password", verifyJWT, ChangePassword);
export default router;
