import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    brandName:{
        type: String,
        required: true
    },
});

const Client = mongoose.model('Client', clientSchema);

export default Client;