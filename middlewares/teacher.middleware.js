import mongoose from "mongoose";
import User from "../models/user.model.js";
import { verify } from "../services/jwt.js";

export default async function auth(req, res, next){
  try {
    if (!req.header.authorization) {
      return res.status(404).json({ message: "auth Token not found" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decodeData = verify(token);
        const id = decodeData._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(404).json({ message: "auth Token inValid" });
        }
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: "auth Token inValid" });
        }
        req.user = user;
        req.role = "teacher";
        next();
      } catch (error) {
        return res.status(401).json({message:"token got expired. login again"});
      }
    } else {
      return res.status(401).json({ message: "Found Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({message:"server error"});
  }
};
