var express = require('express');
const path = require('path');

var user = require('../model/user');
const router = express.Router();
module.exports = router;


router.post("/add",(req,res)=>{
    var u1 = new user();
    u1.name = req.body.name;
    u1.mob = req.body.mob;
    u1.username = req.body.username;
    u1.mail = req.body.mail;
    u1.password = req.body.password;
    u1.role = req.body.role;
   
    u1.save((err,result)=>{
        if(err) throw err;
        else{
            console.log("added user");
            res.send({qid:result._id});
        }
    })
});

router.post("/authenticate",(req,res)=>{
    user.findOne({username:req.body.username,
                  password:req.body.password},(err,result)=>{
        if(err) throw err;
        else{
            res.send(result);
        }
    })
})