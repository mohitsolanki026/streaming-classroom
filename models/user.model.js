import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['teacher', 'user'],
        default: 'user'
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    }
});

const User = mongoose.model('User', userSchema);

export default User;
