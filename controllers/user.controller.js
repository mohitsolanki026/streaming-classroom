import User from "../models/user.model.js"

class UserController {
    async users(req,res){
        try {
            if(req.role != 'teacher'){
                res.status(404).json({ message: 'unauthorize route' }); 
            }

            // users of same client

        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }
    }
}

export default new UserController()