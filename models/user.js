const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);//we used this plugin becoz it automatically adds or creates the username and password fields.


module.exports=mongoose.model('User',userSchema);
