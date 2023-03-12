const express = require("express");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
require("../oppsengineapp/connection/connecting");
const port = 8000;
app.use(express.json());
const oppsenginedata = require("../oppsengineapp/model/schema");
const logingdatas = require("../oppsengineapp/model/loginschema");
const secret="mynameismunnashahiamwithrahul";


app.post("/signup", async (req, res) => {
  try {
    const eamilid=req.body.email;
    const emaildata = await oppsenginedata.findOne({ email: eamilid});
    if(emaildata){
      return  res.send("email is used")
    }
        bcrypt.hash(req.body.password, 10, async function (hashError, hash) {
          if (hashError) {
            return res.json({message:hashError});
          }
            const data = new oppsenginedata({
              username: req.body.username,
              email: req.body.email,
              phone: req.body.phone,
              password: hash,
            }); 
            const senddata = await data.save().then(() => {res.send("successfull");}).catch((err) => {
              console.log(err);
             });
        });
    } catch (e) {
    res.send(e);
  }
});


app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const passwords = req.body.password;
    const usernamedata = await oppsenginedata.findOne({ email: email});

    console.log(usernamedata.email)

    if (!usernamedata){
      return res.json({message:"invalid email"});
    };

     bcrypt.compare(passwords, usernamedata.password, function (error, isMatch) {
      if (error) {
        return res.json({ message: error.message });
      }
      if (isMatch) {
       const tocken=  jwt.sign({id:usernamedata.id, username:usernamedata.email}, secret);
        return res.json({ message: "loging successfull", tocken: tocken});
      } else {
        return res.json({ message: "invalid password" });
      }

    });
  } catch (error) {
    console.log(error);
  }
});



const getuserdetails=(token)=>{
  return new Promise((resolve, reject) => {
    if(token){
     let userdata;
     try {
      userdata=jwt.verify(token, secret);
      resolve(userdata)
     } catch (error) {
      reject("invalid tocken")
     }
    }else{
      reject("tocken not found")
    }
  })

}


app.post("/offerlist", async (req, res)=>{
  const offerdatas=[]
  logingdatas.find().then((offer)=>{
    offer.filter((Offers)=>{
    const rules=Offers.target.split("and");  
    rules.forEach((rule)=>{
      let rulekey={};
      if(rule.includes(">")){
        rulekey={key:rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1])}
        if(req.body[rulekey.key]>rulekey.value){
          offerdatas.push(Offers)
        }
      }
      else{
        rulekey={key:rule.trim().split("<")[0].trim(), value:parseInt(rule.trim().split("<")[1])}
        if(req.body[rulekey.key]<rulekey.value){
          offerdatas.push(Offers)
        }
      }
    })
    })
    res.status(200).send(offerdatas)
  }).catch((err)=>{
    console.log(err)
    res.status(400).send(err)

  })

});

app.post("/create",async(req, res)=>{
  getuserdetails(req.headers.authorization).then((users)=>{
    const data = new logingdatas({
      offer_id: req.body.offer_id,
      offer_title: req.body.offer_title, 
      offer_description: req.body.offer_description, 
      offer_image: req.body.offer_image, 
      offer_sort_order:req.body.offer_sort_order,
      content:req.body.content, 
      schedule:req.body.schedule, 
      target: req.body.target, 
      pricing:req.body.pricing,
      usename:users.username
    }); 
    data.save().then((offer)=>{
      res.status(200).send(offer)
    }).catch((err)=>{
      console.log(err)
      res.status(400).send({message:err.message})
    })
    
  }).catch((err)=>{
    console.log(err)
    res.status(400).send(err)
  })
})


app.put("/update/:id", async(req, res)=>{
  const id=req.params.id;
  const updatedata= await logingdatas.findOneAndUpdate(id, req.body,{
    new:true
  }).then(()=>{
    res.status(200).send("updated successfull")
  }).catch((err)=>{
      res.status(400).send(err)
  })
})

app.delete("/delete", async(req, res)=>{
     const deletedata=await logingdatas.deleteOne(req.body.id).then(()=>{
          res.status(200).send("deleted successfull")
     }).catch((err)=>{
      res.status(400).send(err)
     })
})



app.listen(port, () => {
  console.log(`server is running at port nuber ${port} `);
});
