import Client from "./../models/client.model.js";
import Users from "../models/user.model.js";
// import jwt, {sign,verify} from "./../services/jwt.js";
import jwt from "jsonwebtoken";

class AuthController {
    async clientRegister(req,res){
        try {
            const newUser = await Users.create(req.body);
            res.status(201).json({newUser, message: "User created successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async clientLogin(req,res){
        try {
            const {email,password} = req.body;
            const user =  await Users.findOne({email});
            if(!user) return res.status(404).json({message: "User not found"});
            if(user.password !== password) return res.status(401).json({message: "Incorrect password"});
            const token = sign(user._id,"30d");
            res.status(200).json({token, message: "User logged in successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }        
    }

    async userRegister(req,res){
        try {
            const {clientId} = req.body;
            const client = await Client.findById(clientId);
            if(!client) return res.status(404).json({message: "Client not found"});
            const newUser = await Users.create(req.body);
            res.status(201).json({message: "User created successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async userLogin(req,res){
        try {
            const {email,password} = req.body;
            const user =  await Users.findOne({email});
            if(!user) return res.status(404).json({message: "User not found"});
            if(user.password !== password) return res.status(401).json({message: "Incorrect password"});
            const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "30d"});
            res.status(200).json({token, message: "User logged in successfully"});
        }
        catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }

    async teacherRegister(req,res){
        try {
            const {clientId} = req.user._id;
            const user = await Users.create({...req.body, role: "teacher"});
            res.status(201).json({message: "Teacher created successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

}

export default new AuthController();