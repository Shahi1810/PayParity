const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocaMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocaMongoose);
module.exports=mongoose.model('User',UserSchema);