import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Request",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN);

    const user = await User.findById(decodedToken?.id).select(
      "-password -token"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Access Token",
      });
    }

    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      return res.status(400).json({
        success: false,
        message: "Token has expired",
      });
    } else {
      req.user = user;
      next();
      //   return res.status(200).json({ msg: "Token Valid", user, decodedToken });
    }
  } catch (error) {
    let tokenError = error.name === "TokenExpiredError" ? error.name : "";
    return res.status(tokenError !== "" ? 400 : 500).json({
      success: false,
      message:
        tokenError !== "" ? "Token has expired" : "Error while verifying token",
    });
  }
};

export { verifyJWT };
