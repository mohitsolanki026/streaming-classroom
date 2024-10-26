import mongoose from "mongoose";
import User from "../models/user.model.js";
import { verify } from "../services/jwt.js";

export default async function auth(req, res, next){
  try {
    if (!req.headers.authorization) {
      console.log("auth token not found");
      return res.status(404).json({ message: "auth Token not found",status:"error" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decodeData = verify(token);
        const id = decodeData.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.log("id not valid");
          return res.status(404).json({ message: "auth Token inValid",status:"error" });
        }
        const user = await User.findById(id);
        if (!user) {
          console.log("user not found");
          return res.status(404).json({ message: "auth Token inValid", status:"error" });
        }
        req.user = user;
        req.role = user.role;
        next();
      } catch (error) {
        console.log(error)
        return res.status(401).json({message:"token got expired. login again", status:"error"});
      }
    } else {
      return res.status(401).json({ message: "Found Unauthorized", status:"error" });
    }
  } catch (error) {
    return res.status(500).json({message:"server error", status:"error"});
  }
};
