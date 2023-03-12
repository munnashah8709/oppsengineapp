const mongose=require("mongoose")
const url="mongodb+srv://munnashah8709:Munnashah8709@cluster0.wkkjw5y.mongodb.net/?retryWrites=true&w=majority";
mongose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("database connected successfully")
}).catch((e)=>{
console.log(e)
})





