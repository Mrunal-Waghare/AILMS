import express from "express";
import { googleAuth, login, logout, resetPassword, sendOTP, signup, verifyOTP } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/sendopt", sendOTP);
authRouter.post("/verifyopt", verifyOTP);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/googleauth", googleAuth);


export default authRouter