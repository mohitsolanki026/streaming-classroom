import Client from "../models/client.model.js";
import { verify } from "../services/jwt.js";

export default Auth = async(req,res,next) =>{
    try {
        if(!req.headers.authorizations.split(' ')[1]){
            return res.status(404).json({message:"auth Token not found"})
        }
        const token = req.headers.authorizations.split(' ')[1];
        if(token){
            try {
                const decodeData = verify(token);
                const id = decodeData._id;
                if(!mongoose.Types.ObjectId.isValid(id)){
                    return res.status(404).json({message:"auth Token inValid"})
                }
                const client = await Client.findById(id);
                if(!client){
                    return res.status(404).json({message:"auth Token inValid"})
                }
                req.client = client;
                req.role = "client";
                next();
            } catch (error) {
                return res.status(401).json({message:"token got expired. login again"})
            }
        }
        else{
            return res.status(401).json({message:"Found Unauthorized"})
        }
    } catch (error) {
        return res.status(500).json({message:"server error", error:error.message})
    }
}