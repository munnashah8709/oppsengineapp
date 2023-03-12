const mongose=require("mongoose")

const logingdata=new mongose.Schema({
offer_id: String,
offer_title: String, 
offer_description: String, 
offer_image: String, 
offer_sort_order: Number,
content:Array, 
schedule: Object, 
target: String, 
pricing:Array,
usename:String

});

const logingdatas= new mongose.model("logingdatas",logingdata);
module.exports=logingdatas;