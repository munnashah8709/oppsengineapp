const mongose=require("mongoose")

const signupdata=new mongose.Schema({
    username:String,
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:Number,
    },
    password:String,
   
});


const oppsenginedata= new mongose.model("oppsenginedata",signupdata);
module.exports=oppsenginedata;